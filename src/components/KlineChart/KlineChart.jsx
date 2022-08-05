import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { init, dispose, extension } from 'klinecharts'
import ms from 'ms';

import getDefaultOptions from './defaultStyleOptions'
import useDarkMode, { THEME_MODE } from "hooks/useDarkMode";
import { getData, calculateUpSizeBarData, socket, internalTimeFrame, shapeTemplateSL, shapeTemplateTP } from "components/KlineChart/kline.service";
import NamiExchangeSvg from "components/svg/NamiExchangeSvg";
import colors from "styles/colors";
import { clone, last } from "lodash";
import usePrevious from "hooks/usePrevious";
import { values } from "lodash/object";

const CHART_ID = 'k-line-chart'

let _lastBar;

// Chart instance
// let chart;
extension.addShapeTemplate(shapeTemplateTP)
extension.addShapeTemplate(shapeTemplateSL)

function KLineChart({ symbolInfo, resolution = ms('1m'), mainIndicator = '',
    subIndicator, candle, isResize, chartId = CHART_ID, pairParent, className = '', forceRender,
    shapeTemplate
}) {
    const prevMainIndicator = usePrevious(mainIndicator)
    const prevSubIndicator = usePrevious(subIndicator)
    const prevCandle = usePrevious(candle)
    const chart = useRef(null)
    // Hooks

    // TODO: check default theme not show x,y axis
    const [themeMode] = useDarkMode()

    useEffect(() => {
        chart.current = init(chartId, getDefaultOptions(THEME_MODE.DARK))
        if (chart.current) {
            setTimeout(() => {
                chart.current.resize();
            }, 1000);
        }
    }, [])

    const _getData = useCallback(async (to, from) => {
        if (!symbolInfo?.symbol) return [];
        if (!from) {
            from = to - (chart.current.getWidth().content / chart.current.getDataSpace()) * resolution * 2
        }
        return getData({
            broker: symbolInfo.exchange,
            symbol: symbolInfo.symbol,
            from,
            to,
            resolution
        }).then(data => {
            if (values(internalTimeFrame).includes(resolution)) return data
            return calculateUpSizeBarData(data, resolution)
        }).catch(err => {
            console.error(err)
            return []
        })
    }, [resolution, symbolInfo])

    // Init setup
    useEffect(() => {
        return () => {
            dispose(chartId)
        }
    }, [])

    // Socket sub
    useEffect(() => {
        if (symbolInfo.exchange && symbolInfo.symbol) {
            const removeAction = symbolInfo.exchange === 'NAMI_SPOT' ? 'unsubscribe:recent_trade' : 'unsubscribe:futures:ticker';
            const action = symbolInfo.exchange === 'NAMI_SPOT' ? 'subscribe:recent_trade' : 'subscribe:futures:ticker';
            if (pairParent !== symbolInfo.symbol) {
                socket.emit(removeAction, pairParent)
                socket.emit(action, symbolInfo.symbol)
            }
        }

        return () => {
            if (symbolInfo?.symbol !== pairParent) {
                const action = symbolInfo.exchange === 'NAMI_SPOT' ? 'unsubscribe:recent_trade' : 'unsubscribe:futures:ticker';
                socket.emit(action, symbolInfo.symbol)
            }
        }

    }, [symbolInfo.exchange, symbolInfo.symbol])

    const drawOrder = (order, key) => {
        chart.current.createShape({
            name: key,
            lock: true,
            points: [
                {
                    value: order[key],
                    text: `#${order?.displaying_id} ${key}`,
                    id: order?.displaying_id
                }
            ]
        })
    }

    useEffect(() => {
        if (Array.isArray(shapeTemplate) && shapeTemplate.length > 0) {
            shapeTemplate.map(item => {
                drawOrder(item, 'tp')
                drawOrder(item, 'sl')
            })
        }

    }, [shapeTemplate])

    useEffect(() => {
        if (!chart.current || !symbolInfo) return
        chart.current.setDataSpace(10)
        chart.current.setPriceVolumePrecision(symbolInfo.pricePrecision, 0)
        chart.current.setOffsetRightSpace(80)

        _getData(Date.now().valueOf()).then(data => {
            chart.current.applyNewData(data)
            _lastBar = last(data)
        })

        const action = symbolInfo.exchange === 'NAMI_SPOT' ? 'spot:recent_trade:add' : 'futures:ticker:update';
        socket.on(action, ({ t: time, p: price, q: volume }) => {
            if (!_lastBar) return
            const timeRounded = Math.floor(time / resolution) * resolution
            let data = {
                ..._lastBar,
                low: Math.min(+price, _lastBar.low),
                high: Math.max(+price, _lastBar.high),
                volume: _lastBar.volume + parseInt(volume, 10),
                close: +price
            }
            if (timeRounded > _lastBar.timestamp) {
                // create a new candle, use last close as open **PERSONAL CHOICE**
                data = {
                    timestamp: timeRounded,
                    open: _lastBar.close,
                    high: _lastBar.close,
                    low: _lastBar.close,
                    close: price,
                    volume: data.volume,
                };
            }
            _lastBar = clone(data) // Need clone
            chart.current.updateData(data)
        })
        return () => {
            socket.removeListener(action)
        }
        //trigger ondetail
    }, [symbolInfo?.symbol, resolution, forceRender])

    // Update theme mode
    useEffect(() => {
        if (themeMode && chart.current) {
            chart.current.setStyleOptions(getDefaultOptions(themeMode))
        }
    }, [themeMode])

    // Resolution
    useEffect(() => {
        if (!resolution || !chart.current) return
        _getData(Date.now().valueOf()).then(data => {
            _lastBar = last(data)
            chart.current.applyNewData(data)
        })

        chart.current.loadMore(function (timestamp) {
            _getData(timestamp - resolution).then(data => {
                chart.current.applyMoreData(data, true)
                if (Array.isArray(data) && !data.length) {
                    chart.current.loadMore(function () {
                    })
                }
            })
        })
    }, [resolution])

    // Indicator
    useEffect(() => {
        if (prevMainIndicator !== mainIndicator) {
            if (prevMainIndicator) {
                chart.current.removeTechnicalIndicator('candle_pane', prevMainIndicator)
            }
            if (mainIndicator) {
                chart.current.createTechnicalIndicator(mainIndicator, false, { id: 'candle_pane' })
            }
        }

    }, [mainIndicator])

    useEffect(() => {
        if (!chart.current) return
        if (prevSubIndicator !== subIndicator) {
            if (prevSubIndicator) {
                chart.current.removeTechnicalIndicator('pane_' + prevSubIndicator, prevSubIndicator)
            }

            if (subIndicator) {
                chart.current.createTechnicalIndicator(subIndicator, false, {
                    id: 'pane_' + subIndicator,
                    height: chart.current.getHeight().candle_pane / 4
                })
            }
        }
    }, [subIndicator])

    useEffect(() => {
        if (!chart.current) return
        if (prevCandle !== candle) {
            chart.current.setStyleOptions({
                candle: {
                    type: candle,
                },
            });
        }
    }, [candle])

    useEffect(() => {
        if (!chart.current) return
        chart.current.resize();
    }, [isResize])

    return (
        <div id={chartId} className={`kline-chart flex flex-1 h-full min-h-[300px] ${className}`}>
            <div className="cheat-watermark">
                <NamiExchangeSvg color={themeMode === THEME_MODE.DARK ? colors.grey4 : colors.darkBlue4} />
            </div>
        </div>
    )
}

export default React.memo(KLineChart, (prevProps, nextProps) => {
    return (prevProps?.symbolInfo?.symbol === nextProps?.symbolInfo?.symbol) &&
        (prevProps.mainIndicator === nextProps.mainIndicator) &&
        (prevProps.subIndicator === nextProps.subIndicator) &&
        (prevProps.resolution === nextProps.resolution) &&
        (prevProps.candle === nextProps.candle) &&
        (prevProps.isResize === nextProps.isResize) &&
        (prevProps.chartId === nextProps.chartId) &&
        (prevProps.pairParent === nextProps.pairParent) &&
        (prevProps.className === nextProps.className) &&
        (prevProps.forceRender === nextProps.forceRender) &&
        (prevProps.shapeTemplate === nextProps.shapeTemplate)
})

// ************ Re-Table ***********
// Version: M1
// Author:
// Updated: 09/11/2021
// Reference: https://table-react-component.vercel.app/
// **********************************

// >>> Columns Defs should look like
// [
//     { key: 'coin', dataIndex: 'coin', title: 'Coin', width: 100, fixed: 'left', preventSort: <boolean> },
//     { key: 'last_price', dataIndex: 'last_price', title: 'Last Price', width: 100, preventSort: <boolean> },
//     { key: 'change_24h', dataIndex: 'change_24h', title: 'Change 24h', width: 100, preventSort: <boolean> },
//     { key: 'volume_24h', dataIndex: 'volume_24h', title: 'Volume 24h', width: 100, preventSort: <boolean> },
//     { key: '24h_high', dataIndex: '24h_high', title: '24h High', width: 100, preventSort: <boolean> },
//     { key: '24h_low', dataIndex: '24h_low', title: '24h Low', width: 100, preventSort: <boolean> }
// ]

// >>> Data Source should look like
// [
//     { coin: 'BTC/USDT', last_price: 600000, change_24h: 50%, volume_24h: 1000000, ... },
//     ...
// ]

// !NOTE:
// 1. Resizable only work with initialized column width
// 2.

// !USAGE: Support display list, sorting, pagination, resize column, custom style, ...
// !EXAMPLE: => MarketTable.js => renderTable

import RcTable from 'rc-table';
import styled from 'styled-components';
import colors from 'styles/colors';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import RePagination from 'src/components/common/ReTable/RePagination';

import { memo, useCallback, useEffect, useState } from 'react';
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons';
import { useTranslation } from 'next-i18next';
import { Resizable } from 'react-resizable';
import { castArray, orderBy } from 'lodash';

import 'rc-table/assets/index.css';
import 'react-resizable/css/styles.css';

const HIDE_SORTER = ['star', 'operation']

const DEFAULT_PAGINATION = {
    current: 1,
    pageSize: 10,
}

export const RETABLE_SORTBY = 'sortByValue'

const ReTable = memo(({
    data,
    columns,
    loading,
    resizable,
    sort,
    pagination,
    paginationProps,
    tableStyle,
    tableStatus,
    useRowHover,
    ...restProps }) => {

    // * Init State
    const [ownColumns, setOwnColumns] = useState(columns)
    const [current, setCurrent] = useState(DEFAULT_PAGINATION.current)
    const [pageSize, setPageSize] = useState(DEFAULT_PAGINATION.pageSize)
    const [sorter, setSorter] = useState({})

    // const [state, set] = useState({
    //
    // })

    // * Use Hooks
    const { t } = useTranslation(['common'])
    const [currentTheme, ] = useDarkMode()

    // * Helper
    // const setState = state => set(prevState => ({...prevState, ...state}))

    const handleResize = index => (e, { size }) => {
        setOwnColumns(prevState => {
            const nextColumns = [...prevState]
            nextColumns[index] = {
                ...nextColumns[index],
                width: size.width
            }
            return nextColumns
        })
    }

    // * Overriding
    const components = {
        header: {
            cell: ResizableTitle,
        },
    }

    const _columns = ownColumns.map((col, index) => ({
        ...col,
        onHeaderCell: (column) =>
            ({
                width: column.width,
                onResize: handleResize(index)
            })
    }))

    const renderTable = useCallback(() => {
        let defaultSort = sort && restProps?.defaultSort ?
            orderBy(data, [`${RETABLE_SORTBY}.${restProps?.defaultSort?.key}`],
                            [`${restProps?.defaultSort?.direction || 'asc'}`])
            : data

        let _ = defaultSort

        if (Object.keys(sorter).length) {
            const _s = Object.entries(sorter)[0]
            // console.log('namidev-DEBUG: ___ ', _s[0], _s[1])
            defaultSort = orderBy(data, [`${RETABLE_SORTBY}.${_s[0]}`], [`${_s[1] ? 'desc' : 'asc'}`])
            // console.log(`namidev-DEBUG: After sort by ${_s[0]} `, defaultSort)
        }

        if (paginationProps) {
            if (paginationProps?.current) {
                _ = defaultSort?.slice((paginationProps?.current - 1) * pageSize, paginationProps?.current * pageSize)
            } else {
                _ = defaultSort?.slice((current - 1) * pageSize, current * pageSize)
            }
        }

        // console.log('namidev-DEBUG: Paged ', _)
        // console.log('namidev-DEBUG: Origin ', data)

        return (
            <RcTable data={_}
                     columns={resizable ? _columns : ownColumns}
                     components={resizable && components}
                     emptyText={tableStatus}
                     {...restProps}
            />
        )
    }, [data, resizable, tableStatus, restProps, paginationProps, sort, sorter, current, pageSize])

    const renderPagination = useCallback(() => {
        if (!paginationProps || paginationProps?.hide) return null

        return (
            <div className="py-8 flex items-center justify-center">
                <RePagination total={data?.length}
                              current={current}
                              pageSize={pageSize}
                              onChange={page => setCurrent(page)}
                              {...paginationProps}
                />
            </div>
        )
    }, [paginationProps, data, pageSize, current])


    // Add Sorter
    useEffect(() => {
        const sortColumn = []
        const origin = ['flex', 'items-center']
        let className = [...origin]

        if (typeof sort === 'string' || Array.isArray(sort)) {
            columns.forEach(c => {
                let item = c
                if (castArray(sort).includes(c.key)) {
                    if (c.align === 'left') className.push('justify-start')
                    if (c.align === 'right') className.push('justify-end')
                    if (c.align === 'center') className.push('justify-center')

                    if (!c?.preventSort) {
                        className.push('cursor-pointer')
                    } else {
                        className.push('cursor-text')
                    }

                    item = ({ ...c, title: <div className={className.join(' ')}
                                                onClick={() => !c?.preventSort && setSorter({ [`${c.key}`]: !sorter?.[`${c.key}`] })}
                                           >
                                                    {c.title} {!c?.preventSort && <Sorter isUp={sorter?.[`${c.key}`]}/>}
                                           </div> })
                }
                sortColumn.push(item)
            })
            sortColumn && sortColumn.length && setOwnColumns(sortColumn)
        } else if (sort === 'all' || sort === true) {
            columns.forEach(c => {
                let item = c
                if (!HIDE_SORTER.includes(c.key)) {
                    if (c.align === 'left') className.push('justify-start')
                    if (c.align === 'right') className.push('justify-end')
                    if (c.align === 'center') className.push('justify-center')

                    if (!c?.preventSort) {
                        className.push('cursor-pointer')
                    } else {
                        className.push('cursor-text')
                    }


                    item = ({ ...c, title: <div className={className.join(' ')}
                                                onClick={() => !c?.preventSort && setSorter({ [`${c.key}`]: !sorter?.[`${c.key}`] })}
                                                >
                                                     {c.title} {!c?.preventSort && <Sorter isUp={sorter?.[`${c.key}`]}/>}
                                           </div> })
                }
                sortColumn.push(item)
            })
            sortColumn && sortColumn.length && setOwnColumns(sortColumn)
        }
    }, [sort, columns, sorter])

    // Init Pagination
    useEffect(() => {
        if (paginationProps && Object.keys(paginationProps).length) {
            paginationProps?.pageSize && setPageSize(paginationProps.pageSize)
            paginationProps?.current && setCurrent(paginationProps.current)
        }
    }, [paginationProps])

    // useEffect(() => {
    //     console.log('namidev-DEBUG: reTable => ', current, data)
    // }, [data, current])

    return (
        <ReTableWrapper isDark={currentTheme === THEME_MODE.DARK}
                        useRowHover={useRowHover}
                        {...tableStyle}>
            {renderTable()}
            {renderPagination()}
        </ReTableWrapper>
    )
})

export const ReTableEmpty = ({ msg }) => {
    return (
        <div className="flex items-center justify-center">
            {msg}
        </div>
    )
}

const Sorter = ({ isUp }) => {
    let active
    if (isUp === undefined) {
        active = 1
    } else if (isUp) {
        active = 2
    } else {
        active = 3
    }
    return (
        <SorterWrapper>
            <CaretUpFilled style={active === 2 ? { color: colors.teal } : undefined}/>
            <CaretDownFilled style={active === 3 ? { color: colors.teal } : undefined}/>
        </SorterWrapper>
    )
}

const ResizableTitle = ({ onResize, width, ...restProps }) => {
    if (!width) {
        return <th {...restProps} />
    }

    return (
        <Resizable width={width} height={0} onResize={onResize}>
            <th {...restProps} />
        </Resizable>
    )
}

const ReTableWrapper = styled.div`

  .rc-table {
    color: ${({ isDark }) => isDark ? colors.grey4 : colors.darkBlue};

    .re_table__link {
      font-size: 14px;

      :hover {
        text-decoration: underline !important;
      }
    }
  }

  .rc-table thead th {
    //white-space: nowrap;
  }

  .rc-table-content, .rc-table th, .rc-table td {
    border-color: ${({ isDark }) => isDark ? colors.darkBlue3 : colors.grey4} !important;
    border-right: none;
    border-left: none;
    border-top-width: 0;
  }

  .rc-table th {
    color: ${({ isDark }) => isDark ? colors.darkBlue5 : colors.grey1};
    font-weight: 500;
    padding-bottom: 14px;

    @media (min-width: 1280px) {
      font-size: 14px;
    }
  }

  .rc-table td {
    font-weight: 500;
    font-size: 14px;

    @media (min-width: 1280px) {
      font-size: 16px;
    }
  }

  .rc-table thead td, .rc-table thead th,
  .rc-table tbody tr td, .rc-table tbody tr th {
    background: ${({ isDark }) => isDark ? colors.darkBlue2 : colors.white};
  }

  .rc-table-content {
    overflow: auto;
  }

  .rc-table-cell-fix-right {
    z-index: 15;
    
    ::after {
      visibility: ${({ shadowWithFixedCol }) => shadowWithFixedCol ? 'visible' : 'hidden'};
      box-shadow: ${({ isDark }) => isDark ? 'inset -10px 0 8px -8px #263459'
                                           : 'inset -10px 0 8px -8px #f2f4f6'} !important;
    }
  }

  .rc-table-cell-fix-right-first, .rc-table-cell-fix-right-last {
    z-index: 15;
    box-shadow: ${({ isDark }) => isDark ? '-1px 0 0 #263459'
            : '-1px 0 0 #f2f4f6'} !important;
  }

  .rc-table-cell-fix-left {
    z-index: 15;
    ::after {
      visibility: ${({ shadowWithFixedCol }) => shadowWithFixedCol ? 'visible' : 'hidden'};
      box-shadow: ${({ isDark }) => isDark ? 'inset 10px 0 8px -8px #263459' : 'inset 10px 0 8px -8px #f2f4f6'} !important;
    }
  }

  .rc-table-expanded-row-fixed {
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    ${({ noDataStyle }) => noDataStyle ? {...noDataStyle} : ''};

    ::after {
      display: none;
    }
  }

  table {
    width: 100% !important;
    ${({ tableStyle }) => tableStyle ? {...tableStyle} : ''};

    thead tr, tbody tr {
      position: relative;
      cursor: ${({ useRowHover }) => useRowHover ? 'pointer' : 'normal'} !important;
    }
    
    tbody tr {
      .rc-table-cell-fix-right:last-child:not(.rc-table-cell-fix-sticky) {
        background: ${({ isDark }) => isDark ? colors.darkBlue2 : colors.white} !important;
      }
    }

    tbody tr:last-child {
      td {
        border-bottom-width: 0;
      }
    }

    tbody tr:hover td {
      background: ${({ useRowHover, isDark }) => useRowHover ? isDark ? 'rgba(38, 52, 89, 0.5)' : colors.lightTeal : undefined};
      cursor: ${({ useRowHover }) => useRowHover ? 'pointer' : 'normal'} !important;
    }

    thead tr th:first-child, tbody tr td:first-child {
      padding-left: ${({ paddingHorizontal }) => paddingHorizontal ? paddingHorizontal : 0};
    }

    thead tr th:last-child, tbody tr td:last-child {
      padding-right: ${({ paddingHorizontal }) => paddingHorizontal ? paddingHorizontal : 0};
    }

    tbody tr td:first-child {
      border-top-left-radius: ${({ rowRadius }) => rowRadius ? rowRadius : 0};
      border-bottom-left-radius: ${({ rowRadius }) => rowRadius ? rowRadius : 0};
    }

    tbody tr td:last-child {
      border-top-right-radius: ${({ rowRadius }) => rowRadius ? rowRadius : 0};
      border-bottom-right-radius: ${({ rowRadius }) => rowRadius ? rowRadius : 0};
    }

    thead tr {
      ${({ headerStyle }) => headerStyle ? {...headerStyle} : ''};
      user-select: none;

        th {
            ${({ headerFontStyle }) => headerFontStyle ? {...headerFontStyle} : ''};
        }
    }

    tbody tr {
      ${({ rowStyle }) => rowStyle ? {...rowStyle} : ''}
      transition: all .2s ease;

      :hover {
        box-shadow: 0 7px 23px rgba(0, 0, 0, 0.05);
      }
    }
  }
`

const SorterWrapper = styled.span`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding-left: 10px;
  margin-top: -2px;

  span:first-child {
    transform: translateY(2px);
  }

  span {
    width: 7px;
    height: 7px;

    svg {
      width: 100%;
      height: auto;
    }
  }
`

export default ReTable

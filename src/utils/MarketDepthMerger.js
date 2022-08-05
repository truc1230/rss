import { groupBy, map, orderBy, sumBy } from 'lodash';
import { getDecimalScale } from 'redux/actions/utils';

export const handleTickSize = (data, tickSize, type = null) => {
    let _exp = -2

    if (tickSize < 1) {
        _exp = -getDecimalScale(tickSize)
    } else {
        if (tickSize === 1) {
            _exp = 0
        } else if (tickSize % 10 === 0) {
            _exp = `${tickSize}`.substring(1)?.length || 1
        }
    }

    const _data = data.map((e) => {
        let rate

        if (type === 'ask') {
            rate = decimalAdjust('ceil', +e[0], _exp)
        } else {
            rate = decimalAdjust('floor', +e[0], _exp)
        }

        return { rate, rateRaw: +e[0], amount: +e[1] }
    })
    const group = groupBy(_data, 'rate')
    const output = []
    map(group, (objs, key) => {
        output.push([key, sumBy(objs, 'amount')])
        return true
    })

    // asks = orderBy(asks, [(e) => +e[0]], ['desc'])
    // bids = orderBy(bids, [(e) => -e[0]])

    return type === 'ask'
        ? orderBy(output, (e) => +e[0], 'desc')
        : orderBy(output, (e) => -e[0])
}

function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value)
    }
    value = +value
    exp = +exp
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN
    }
    // Shift
    value = value.toString().split('e')
    value = Math[type](+(value[0] + 'e' + (value[1] ? +value[1] - exp : -exp)))
    // Shift back
    value = value.toString().split('e')
    return +(value[0] + 'e' + (value[1] ? +value[1] + exp : exp))
}

export default {
    handleTickSize,
    decimalAdjust,
}

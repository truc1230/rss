export const exampleEA = (PineJS) => {
    return {
        // Replace the EATEST with your study name
        // The name will be used internally by the Charting Library
        name: 'EATEST',
        metainfo: {
            '_metainfoVersion': 40,
            'id': 'EATEST@tv-basicstudies-1',
            'scriptIdPart': '',
            'name': 'EATEST',

            // This description will be displayed in the Indicators window
            // It is also used as a "name" argument when calling the createStudy method
            'description': '<study description>',

            // This description will be displayed on the chart
            'shortDescription': '<short study description>',

            'is_hidden_study': true,
            'is_price_study': true,
            'isCustomIndicator': true,

            'plots': [{ 'id': 'plot_0', 'type': 'line' }],
            'defaults': {
                'styles': {
                    'plot_0': {
                        'linestyle': 0,
                        'visible': true,

                        // Plot line width.
                        'linewidth': 2,

                        // Plot type:
                        //    1 - Histogram
                        //    2 - Line
                        //    3 - Cross
                        //    4 - Area
                        //    5 - Columns
                        //    6 - Circles
                        //    7 - Line With Breaks
                        //    8 - Area With Breaks
                        'plottype': 2,

                        // Show price line?
                        'trackPrice': false,

                        // Plot transparency, in percent.
                        'transparency': 40,

                        // Plot color in #RRGGBB format
                        'color': '#0000FF',
                    },
                },

                // Precision of the study's output values
                // (quantity of digits after the decimal separator).
                'precision': 2,

                'inputs': {},
            },
            'styles': {
                'plot_0': {
                    // Output name will be displayed in the Style window
                    'title': '-- output name --',
                    'histogramBase': 0,
                },
            },
            'inputs': [],
        },

        constructor() {
            this.init = function (context, inputCallback) {
                this._context = context;
                this._input = inputCallback;

                // Define the symbol to be plotted.
                // Symbol should be a string.
                // You can use PineJS.Std.ticker(this._context) to get the selected symbol's ticker.
                // For example,
                //    var symbol = "AAPL";
                //    var symbol = "#EQUITY";
                //    var symbol = PineJS.Std.ticker(this._context) + "#TEST";
                const symbol = '<TICKER>';
                this._context.new_sym(symbol, PineJS.Std.period(this._context), PineJS.Std.period(this._context));
            };

            this.main = function (context, inputCallback) {
                this._context = context;
                this._input = inputCallback;

                this._context.select_sym(1);

                // You can use following built-in functions in PineJS.Std object:
                //    open, high, low, close
                //    hl2, hlc3, ohlc4
                const v = PineJS.Std.close(this._context);
                return [v];
            };
        },
    };
};

export const MANami = function (PineJS) {
    return {
        // Replace the EATEST with your study name
        // The name will be used internally by the Charting Library
        name: 'MANAMI',
        metainfo: {
            _metainfoVersion: 27,
            isTVScript: false,
            isTVScriptStub: false,
            is_hidden_study: false,
            defaults: {
                styles: {
                    plot_0: {
                        linestyle: 0,
                        linewidth: 1,
                        plottype: 0,
                        trackPrice: !1,
                        transparency: 0,
                        visible: !0,
                        color: '#ceb917',
                    },
                    plot_1: {
                        linestyle: 0,
                        linewidth: 1,
                        plottype: 0,
                        trackPrice: !1,
                        transparency: 0,
                        visible: !0,
                        color: '#ee02ee',
                    },
                    plot_2: {
                        linestyle: 0,
                        linewidth: 1,
                        plottype: 0,
                        trackPrice: !1,
                        transparency: 0,
                        visible: !0,
                        color: '#b7035e',
                    },
                    // plot_3: {
                    //     linestyle: 0,
                    //     linewidth: 1,
                    //     plottype: 0,
                    //     trackPrice: !1,
                    //     transparency: 0,
                    //     visible: !0,
                    //     color: '#00cccc',
                    // },
                },
                precision: 4,
                inputs: {
                    in_0: 7,
                    in_1: 'close',
                    in_2: 34,
                    in_3: 'close',
                    in_4: 89,
                    in_5: 'close',
                    // in_6: 168,
                    // in_7: 'close',
                },
                text: 'MA',
            },
            plots: [
                {
                    id: 'plot_0',
                    type: 'line',
                }, {
                    id: 'plot_1',
                    type: 'line',
                }, {
                    id: 'plot_2',
                    type: 'line',
                },
                // {
                //     id: 'plot_3',
                //     type: 'line',
                // }
            ],
            styles: {
                plot_0: {
                    title: 'Line 1',
                    histogramBase: 0,
                    joinPoints: false,
                },
                plot_1: {
                    title: 'Line 2',
                    histogramBase: 0,
                    joinPoints: false,
                },
                plot_2: {
                    title: 'Line 3',
                    histogramBase: 0,
                    joinPoints: false,
                },
                // plot_3: {
                //     title: 'Line 4',
                //     histogramBase: 0,
                //     joinPoints: false,
                // },
            },
            description: 'MANAMI',
            shortDescription: 'MA',
            is_price_study: true,
            inputs: [
                {
                    id: 'in_0',
                    name: 'Length',
                    defval: 7,
                    type: 'integer',
                    min: 1,
                    max: 1e4,
                }, {
                    id: 'in_1',
                    name: 'Source',
                    defval: 'close',
                    type: 'source',
                    options: ['open', 'high', 'low', 'close', 'hl2', 'hlc3', 'ohlc4'],
                }, {
                    id: 'in_2',
                    name: 'Length 2',
                    defval: 34,
                    type: 'integer',
                    min: 1,
                    max: 1e4,
                }, {
                    id: 'in_3',
                    name: 'Source 2',
                    defval: 'close',
                    type: 'source',
                    options: ['open', 'high', 'low', 'close', 'hl2', 'hlc3', 'ohlc4'],
                }, {
                    id: 'in_4',
                    name: 'Length 3',
                    defval: 89,
                    type: 'integer',
                    min: 1,
                    max: 1e4,
                }, {
                    id: 'in_5',
                    name: 'Source 3',
                    defval: 'close',
                    type: 'source',
                    options: ['open', 'high', 'low', 'close', 'hl2', 'hlc3', 'ohlc4'],
                },
                // {
                //     id: 'in_6',
                //     name: 'Length 4',
                //     defval: 168,
                //     type: 'integer',
                //     min: 1,
                //     max: 1e4,
                // }, {
                //     id: 'in_7',
                //     name: 'Source 4',
                //     defval: 'close',
                //     type: 'source',
                //     options: ['open', 'high', 'low', 'close', 'hl2', 'hlc3', 'ohlc4'],
                // }
            ],
            id: 'MANAMI@tv-basicstudies-1',
            scriptIdPart: '',
            name: 'MANAMI',
        },

        constructor() {
            this.main = function (context, inputCallback) {
                this._context = context;
                this._input = inputCallback;

                const i0 = PineJS.Std[this._input(1)](this._context);
                const r0 = this._input(0);
                const s0 = this._context.new_var(i0);

                const i1 = PineJS.Std[this._input(3)](this._context);
                const r1 = this._input(2);
                const s1 = this._context.new_var(i1);

                const i2 = PineJS.Std[this._input(5)](this._context);
                const r2 = this._input(4);
                const s2 = this._context.new_var(i2);

                // const i3 = PineJS.Std[this._input(7)](this._context);
                // const r3 = this._input(6);
                // const s3 = this._context.new_var(i3);
                return [{
                    value: PineJS.Std.sma(s0, r0, this._context),
                }, {
                    value: PineJS.Std.sma(s1, r1, this._context),
                }, {
                    value: PineJS.Std.sma(s2, r2, this._context),
                },
                // {
                //     value: PineJS.Std.sma(s3, r3, this._context),
                // }
                ];
            };
        },
    };
};

import { memo, useCallback, useEffect, useState } from 'react';
import useElementSize from 'hooks/useElementSize';

const DashedProgressLine = memo(({
    containerClass = '',
    progressLineClass = '',
    dashedWidth,
    dashedSize = 5,
    offset = 1,
    isMore = false,
    completed = undefined
}) => {

    const [dashedLength, setDashedLength] = useState(0)
    const { size: { height }, ref: wrapperRef } = useElementSize()

    const renderDashed = useCallback(() => {
        const dashes = []
        for (let i = 0; i < dashedLength; ++i) {
            const originClass = 'block '
            let className = ''

            if (completed !== undefined) {
                className = completed ?
                    originClass + 'bg-bgContainer dark:bg-bgContainer-dark'
                    : originClass + 'bg-gray-2 dark:bg-darkBlue-4'
            } else {
                className = originClass + 'bg-bgContainer dark:bg-bgContainer-dark'
            }

            dashes.push(
                <span key={`dashes__${i}`} style={{
                    width: dashedWidth || 2,
                    height: offset,
                    marginBottom: dashedSize
                }}
                      className={className}/>
            )
        }
        return dashes
    }, [dashedLength, dashedSize, dashedWidth, offset, completed])

    useEffect(() => {
        if (height) {
            isMore ? setDashedLength(height / offset) : setDashedLength((height / offset) / 2)
        }
    }, [height, offset, isMore])

    return (
        <div ref={wrapperRef}
             style={{ width: dashedWidth || 2 }}
             className={'relative h-full flex flex-col overflow-hidden ' + containerClass}>
            <div className="relative z-20">
                {renderDashed()}
            </div>
            <div style={{
                height: completed !== undefined ? (completed ? height : 0) : height,
            }}
                 className={'absolute z-10 top-0 left-0 w-full transition-all duration-200 ease-in bg-dominant ' + progressLineClass}/>
        </div>
    )
})

export default DashedProgressLine

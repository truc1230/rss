import styled from 'styled-components';

const CustomContainer = ({ children, dimension =  { test: 'red'} }) => {
    return (
        <Wrapper dimension={dimension}>
            {children}
        </Wrapper>
    )
}

const Wrapper = styled.div.attrs({ className: 'mal-container px-4' })`
  ${({ dimension }) => {
      return `
        color: ;
        
      `
  }}
`

export default CustomContainer

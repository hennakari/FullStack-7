import styled from 'styled-components'
import { Link } from 'react-router-dom'

const Page = styled.div`
  padding: 1em;
  background: White;
  font-family: Montserrat;
`

const Navigation = styled.div`
  background: DimGray;
  padding: 0.5em;
  color: White;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
`

const Input = styled.input`
  margin: 0.25em;
  border: none;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  height: 1.5em;
`

const StyledLinkNav = styled(Link)`
  color: White;
  text-decoration: none;
  font-weight: bold;
  margin: 0.25rem;
  padding: 0.5em;
  text-transform: uppercase
`

const StyledLink = styled(Link)`
  color: #404040;
  text-decoration: none;
  margin: 0.25rem;
  padding: 0.5em;
`

const Button = styled.button`
  color: #fff;
  padding: 0.25em 1em;
  margin: 0.25em;
  border-radius: 50px;
  background-color: #F78FB7;
  background-image: radial-gradient(93% 87% at 87% 89%, rgba(0, 0, 0, 0.23) 0%, transparent 86.18%), radial-gradient(66% 87% at 26% 20%, rgba(255, 255, 255, 0.41) 0%, rgba(255, 255, 255, 0) 69.79%, rgba(255, 255, 255, 0) 100%);
  box-shadow: 2px 19px 31px rgba(0, 0, 0, 0.2);
  font-size: 1em;
  border: 0;

  cursor: pointer;
`
const ListItem = styled.div`
  background: #f2f2f2;
  padding: 0.5em;
  margin: 0.15em;
`
const Header = styled.h2`
  color: HotPink;
  font-family: Montserrat;
  font-size: 2em;
`

const Span = styled.span`
  color: white;
  margin: 0.25rem;
  padding: 0.5em;
  padding-left: 3em;
`

const MarginDiv = styled.div`
  margin-top: 1em;
`

const ErrorDiv = styled.div`
  background: #f2f2f2;
  padding: 0.5em;
  color: Red;
  border: 1px solid Red;
  margin-bottom: 1.5em;
`


const SuccessDiv = styled.div`
  background: #f2f2f2;
  padding: 0.5em;
  color: #4BC99D;
  border: 1px solid #4BC99D;
  margin-bottom: 1.5em;
`

export { Page, Navigation, Input, StyledLinkNav, StyledLink, Button, ListItem, Header, Span, MarginDiv, ErrorDiv, SuccessDiv }

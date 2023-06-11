import styled from "styled-components";
import { LIGHTGREY, MEDIUMGREY, MEDIUMROUNDED, OPENSANS } from "../../sharedUtils.js";

export const SubtenantRequestTitle = styled.p`
    font-size: 2rem;
    font-weight: 700;
    font-family: ${OPENSANS};
    margin-bottom: 2px;
`

export const SubtenantRequestText = styled.p`
    font-size: 1rem;
    font-family: ${OPENSANS};
`

export const SubtenantRequestSubheading = styled.p`
    font-size: 1.3rem;
    font-weight: 700;
    font-family: ${OPENSANS};
    margin-bottom: 2px;
`
export const SubleaseDetailContainer = styled.div`
    width: 90vw ;
    border-width: 1px;
    border-color: ${LIGHTGREY};
    border-style: solid;
    flex-direction: row;
    border-radius: 10px;
    padding: 1vh;
    display: flex;
    margin-top: 1vh
`

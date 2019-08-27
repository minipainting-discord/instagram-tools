import { css } from "@emotion/core"
import styled from "@emotion/styled/macro"

const c = {
  blue: "#08f",
  lightblue: "#0af",
  darkgray: "#333",
  gray: "#888",
  lightgray: "#eee",
}

const noSpacing = css`
  margin: 0;
  padding: 0;
`

const button = css`
  font-weight: bold;
  margin: 0.8rem 0;
  background-color: ${c.blue};
  color: white;
  padding: 0.6rem 1.2rem;
  display: flex;
  align-items: center;
  border: none;

  &:disabled {
    background-color: ${c.gray};
  }

  &:focus {
    background-color: ${c.lightblue};
  }
`

export default {
  tags(builder) {
    return builder(styled)
  },

  globalStyles: css`
    html,
    body,
    #root {
      height: 100%;
      overflow: hidden;
    }
  `,

  app: css`
    font-size: 1.6rem;
    color: ${c.darkgray};
    background-color: white;
    overflow: auto;
    max-height: 100%;
    display: flex;
    flex-direction: column;

    button {
      ${button};
    }
  `,

  tabs: css`
    ${noSpacing};
    background-color: ${c.blue};
    display: flex;
    list-style-type: none;
    padding: 3.2rem 3.2rem 1.6rem;
  `,

  tab: ({ active }) => css`
    padding: 0.8rem 1.2rem;
    font-size: 2rem;
    margin-left: -1px;
    background-color: ${active ? "white" : "transparent"};
    border-radius: 5px;
    color: ${active ? c.darkgray : "white"};
    cursor: pointer;
    margin-right: 0.8rem;

    &:hover {
      background-color: ${active ? "white" : c.lightblue};
    }
  `,

  screen: css`
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1.6rem 3.2rem 3.2rem;
    width: 100%;
  `,

  /* Post generator */
  formField: css`
    display: flex;
    width: 100%;
    max-width: 72rem;
    flex-direction: column;
    margin: 0 0 1.6rem;

    label {
      font-weight: bold;
      margin: 0.8rem 0;
    }

    input[type="checkbox"] {
      align-self: flex-start;
    }
  `,

  postPreview: css`
    width: 100%;
    max-width: 72rem;
    height: 12em;
    padding: 0.8rem;
  `,

  /* User Database */
  userList: css`
    width: 100%;
    max-width: 72rem;
    table {
      width: 100%;
      border: 1px solid ${c.gray};
      margin-bottom: 1rem;
    }

    td,
    th {
      padding: 0.8rem 1.2rem;
      border-left: 1px solid ${c.gray};
      border-right: 1px solid ${c.gray};
    }

    th {
      background-color: ${c.lightgray};
      border: 1px solid ${c.gray};
      width: 50%;
    }

    tr:nth-child(even) {
      background-color: ${c.lightgray};
    }
  `,

  userSearchBox: css`
    display: flex;
    margin: 0 0 1.6rem;
    align-items: center;

    input {
      margin-left: 0.8rem;
      flex: 1;
    }
  `,

  /* Image Builder */
  uploader: css`
    label {
      ${button};

      svg {
        margin-right: 0.6rem;
      }
    }
    input[type="file"] {
      width: 0.1px;
      height: 0.1px;
      opacity: 0;
      overflow: hidden;
      position: absolute;
      z-index: -1;
    }
  `,

  picker: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    label {
      font-weight: bold;
      margin: 0.8rem 0;
    }
  `,

  radio: css`
    input[type="radio"] {
      width: 0.1px;
      height: 0.1px;
      opacity: 0;
      overflow: hidden;
      position: absolute;
      z-index: -1;
    }

    label {
      font-weight: normal;
      cursor: pointer;
      display: flex;

      &::before {
        display: block;
        content: "";
        width: 1em;
        height: 1em;
        border: 0.1rem solid #999;
        margin-right: 0.8rem;
        transition: all 100ms ease-in;
      }
    }

    input[type="radio"][disabled] + label {
      color: #aaa;
      cursor: default;
    }

    input[type="radio"][disabled] + label::before {
      border-color: #aaa;
    }

    input[type="radio"]:checked + label::before {
      border-color: ${c.blue};
      background-color: ${c.blue};
    }
  `,

  split: css`
    display: flex;
    width: 100%;
    height: 100%;
    overflow: auto;
  `,

  cropper: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 1.6rem;
    overflow: auto;

    button {
      display: inline-block;
      margin-top: 0.8rem;

      &:disabled {
        background-color: #eee;
        color: #999;
      }
    }
  `,

  outputs: css`
    flex: 1;
    overflow: auto;
  `,

  output: css`
    display: inline-block;
    margin-bottom: 1.6rem;
  `,
}

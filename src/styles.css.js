import { css } from "@emotion/core"
import styled from "@emotion/styled/macro"

const c = {
  blue: "#08f",
  lightblue: "#0af",
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
    background-color: #888;
  }

  &:focus {
    background-color: ${c.lightblue};
  }
`

export default {
  tags(builder) {
    return builder(styled)
  },

  app: css`
    font-size: 1.6rem;
    margin: 3.2rem;
    color: #333;

    button {
      ${button};
    }
  `,

  tabs: css`
    ${noSpacing};
    display: flex;
    list-style-type: none;
  `,

  tab: ({ active }) => css`
    padding: 0.8rem 1.2rem;
    border: 1px solid #888;
    margin-left: -1px;
    background-color: ${active ? "#888" : "transparent"};
    color: ${active ? "white" : "inherit"};
    cursor: pointer;
  `,

  screen: css`
    margin: 1.6rem 0;
  `,

  postGenerator: css`
    display: flex;
    flex-direction: column;
    max-width: 72rem;
  `,

  formField: css`
    display: flex;
    width: 100%;
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
    height: 12em;
    padding: 0.8rem;
  `,

  imageBuilder: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  `,

  userDatabase: css`
    max-width: 72rem;
  `,

  updateUsersForm: css`
    display: flex;
    flex-direction: column;
    textarea {
      width: 100%;
      height: 6em;
    }
  `,

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
  `,

  cropper: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 614px;
    margin-right: 1.6rem;

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
    min-width: 614px;
  `,

  output: css`
    display: inline-block;
    margin-bottom: 1.6rem;
  `,
}

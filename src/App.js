import React from "react"
import styles from "./styles.css"

import db from "./db"
import PostGenerator from "./PostGenerator"
import ImageBuilder from "./ImageBuilder"
import UserDatabase from "./UserDatabase"

const URLS = {
  POSTGENERATOR: "#new-post",
  IMAGEBUILDER: "#new-image",
  USERDB: "#user-db",
}

const T = styles.tags(styled => ({
  App: styled.div(styles.app),
  Tabs: styled.ul(styles.tabs),
  Tab: styled.li(styles.tab),
  Screen: styled.section(styles.screen),
}))

export const AppContext = React.createContext({ users: [] })

class App extends React.Component {
  static TABS = [
    {
      url: URLS.IMAGEBUILDER,
      label: "Image Builder",
      Component: ImageBuilder,
    },
    {
      url: URLS.POSTGENERATOR,
      label: "Post Generator",
      Component: PostGenerator,
    },
    {
      url: URLS.USERDB,
      label: "User DB",
      Component: UserDatabase,
    },
  ]

  state = {
    currentTab: Object.values(URLS).includes(window.location.hash)
      ? window.location.hash
      : URLS.IMAGEBUILDER,
    users: [],
  }

  setTab = currentTab => () =>
    this.setState({ currentTab }, () => {
      window.location.hash = this.state.currentTab
    })

  componentDidMount() {
    db.onUpdate(users => {
      this.setState({ users })
    })
    db.load()
  }

  render() {
    const { currentTab, users } = this.state

    return (
      <T.App>
        <T.Tabs>
          {App.TABS.map(({ url, label }) => (
            <T.Tab
              key={url}
              active={currentTab === url}
              onClick={this.setTab(url)}
            >
              {label}
            </T.Tab>
          ))}
        </T.Tabs>
        <AppContext.Provider value={{ users }}>
          <T.Screen>
            {App.TABS.map(
              ({ url, Component }) =>
                currentTab === url && <Component key={url} />,
            )}
          </T.Screen>
        </AppContext.Provider>
      </T.App>
    )
  }
}

export default App

import React from "react"

import { AppContext } from "./App"
import { Icon } from "./ui"
import styles from "./styles.css"

const T = styles.tags(styled => ({
  UserDatabase: styled.div(styles.userDatabase),
  UserList: styled.ul(styles.userList),
  SearchBox: styled.div(styles.userSearchBox),
}))

class UserDatabase extends React.Component {
  state = {
    filter: "",
  }

  updateFilter = ev => this.setState({ filter: ev.target.value })

  render() {
    const { filter } = this.state
    return (
      <T.UserDatabase>
        <h1>Users</h1>
        <AppContext.Consumer>
          {({ users }) => (
            <T.UserList>
              <T.SearchBox>
                <Icon name="magnifying-glass" />
                <input type="text" onChange={this.updateFilter} />
              </T.SearchBox>
              <table>
                <thead>
                  <tr>
                    <th>Discord</th>
                    <th>Instagram</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter(u =>
                      filter.length
                        ? [u.discordName, u.igHandle].some(field =>
                            field.includes(filter),
                          )
                        : true,
                    )
                    .map(user => (
                      <tr>
                        <td>{user.discordName}</td>
                        <td>
                          <a href={user.igUrl}>{user.igHandle}</a>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </T.UserList>
          )}
        </AppContext.Consumer>
      </T.UserDatabase>
    )
  }
}

export default UserDatabase

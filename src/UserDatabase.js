import React from "react"

import { AppContext } from "./App"
import styles from "./styles.css"

const T = styles.tags(styled => ({
  UserDatabase: styled.div(styles.userDatabase),
  UserList: styled.ul(styles.userList),
}))

class UserDatabase extends React.Component {
  render() {
    return (
      <T.UserDatabase>
        <h1>Users</h1>
        <AppContext.Consumer>
          {({ users }) => (
            <T.UserList>
              <table>
                <thead>
                  <tr>
                    <th>Discord</th>
                    <th>Instagram</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
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

import React from "react"

import texts from "./texts"

import { Icon } from "./ui"
import { AppContext } from "./App"
import styles from "./styles.css"

const T = styles.tags(styled => ({
  PostGenerator: styled.div(styles.screen),
  UserPicker: styled(({ value, onChange, className, users }) => (
    <div className={className}>
      <datalist id="userlist">
        {users.map(user => (
          <option key={user.discordName} value={user.igHandle}>
            {user.discordName} ({user.igHandle})
          </option>
        ))}
      </datalist>
      <label htmlFor="username">Discord Username</label>
      <input
        {...{ value, onChange }}
        list="userlist"
        id="username"
        autoComplete="off"
      />
    </div>
  ))(styles.formField),
  PluralChecker: styled(({ value, onChange, className }) => (
    <div className={className}>
      <label htmlFor="plural">Plural?</label>
      <input
        type="checkbox"
        {...{ value, onChange }}
        id="plural"
        autoComplete="off"
      />
    </div>
  ))(styles.formField),
  Actions: styled.div(styles.actions),
  PostPreview: styled.textarea(styles.postPreview),
}))

class PostGenerator extends React.Component {
  state = {
    dirty: false,
    username: "",
    plural: false,
    draft: "",
  }

  onChangeUsername = ev => this.setState({ username: ev.currentTarget.value })

  onChangePlural = ev => this.setState({ plural: ev.currentTarget.checked })

  onChangeDraft = ev => this.setState({ draft: ev.currentTarget.value })

  componentDidMount() {
    this.generateDraft()
  }

  componentDidUpdate() {
    const { dirty } = this.state
    if (dirty) {
      this.generateDraft()
    }
  }

  generateDraft() {
    this.setState({ draft: makeDraft(this.state), dirty: false })
  }

  render() {
    const { username, plural, draft } = this.state

    return (
      <T.PostGenerator>
        <AppContext.Consumer>
          {({ users }) => (
            <>
              <T.UserPicker
                users={users}
                value={username}
                onChange={this.onChangeUsername}
              />
              <T.PluralChecker value={plural} onChange={this.onChangePlural} />
              <T.Actions>
                <button onClick={() => this.setState({ dirty: true })}>
                  <Icon name="cycle" />
                </button>
              </T.Actions>
              <T.PostPreview
                value={renderPost(draft, this.state)}
                onChange={this.onChangeDraft}
              />
            </>
          )}
        </AppContext.Consumer>
      </T.PostGenerator>
    )
  }
}

function renderPost(post, settings) {
  return post
    .replace(
      "{username}",
      settings.username.length ? settings.username : "NO-USERNAME",
    )
    .replace("{s}", settings.plural ? "s" : "")
}

function makeDraft(settings) {
  const intro = randomItem(texts.intros)
  const incentive = randomItem(texts.incentives)
  const linkInBio = "Link in our bio."
  const hashtags = texts.hashtags.join(" ")

  return [intro, incentive, linkInBio, hashtags].join("\n")
}

function randomItem(array) {
  const i = Math.floor(Math.random() * array.length)
  return array[i]
}

export default PostGenerator

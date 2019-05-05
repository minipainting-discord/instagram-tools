const db = {
  users: [],
  listeners: [],

  load() {
    const fromStorage = localStorage.getItem("users")

    this.users = fromStorage ? JSON.parse(fromStorage) : []
    this.didUpdate()
  },

  save() {
    localStorage.setItem("users", JSON.stringify(this.users))
  },

  update(newUsers) {
    this.users = newUsers
    this.save()
    this.didUpdate()
  },

  onUpdate(listener) {
    this.listeners.push(listener)
  },

  didUpdate() {
    this.listeners.forEach(listener => listener(this.users))
  },
}

export default db

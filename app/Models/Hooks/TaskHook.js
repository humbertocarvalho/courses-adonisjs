'use strict'

const Kue = use('Kue')
const NewTaskMailJob = use('App/Jobs/NewTaskMail')

const TaskHook = (exports = module.exports = {})

TaskHook.sendNewTaskMail = async taskInstance => {
  if (taskInstance.dirty.user_id || taskInstance.user_id) {
    const { email, username } = await taskInstance.user().fetch()

    const file = await taskInstance.file().fetch()

    const { title } = taskInstance

    Kue.dispatch(
      NewTaskMailJob.key,
      { email, username, file, title },
      { attempts: 3 }
    )
  }
}

'use strict'

const Mail = use('Mail')
const Helpers = use('Helpers')
const TaskHook = (exports = module.exports = {})

TaskHook.sendNewTaskMail = async taskInstance => {
  if (taskInstance.dirty.user_id || taskInstance.user_id) {
    const { email, username } = await taskInstance.user().fetch()

    const file = await taskInstance.file().fetch()

    const { title } = taskInstance
    await Mail.send(
      ['emails.new_task'],
      {
        username,
        title,
        hasAttachment: !!file
      },
      message => {
        message
          .to(email)
          .from('humberto@viezzer.com.br', 'Humberto')
          .subject('Nova tarefa para você')

        if (file) {
          message.attach(Helpers.tmpPath(`uploads/${file.file}`), {
            filename: file.name
          })
        }
      }
    )
  }
}

Meta data: data that does not originate from the gameplay
but may affect it, ex. is the user logged in? We may want to reward that.

May be overwritten each session.

Changes don't count towards parent state revisions, since it's "meta-information" about the game.

Also, those changes don't have to be persisted to the server
since the server should be able to know about meta and re-update as well.

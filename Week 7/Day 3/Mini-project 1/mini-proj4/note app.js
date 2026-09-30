const _ = require('lodash');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const notes = require('./notes');

function reportStorageError(error) {
	console.error(`Unable to access notes: ${error.message}`);
	process.exitCode = 1;
}

yargs(hideBin(process.argv))
	.command('add', 'Add a note', (command) => command
		.option('title', { type: 'string', demandOption: true, describe: 'Note title' })
		.option('body', { type: 'string', demandOption: true, describe: 'Note body' }), (args) => {
			const title = args.title.trim();
			const body = args.body.trim();
			if (!title || !body) {
				console.error('Title and body cannot be empty');
				process.exitCode = 1;
				return;
			}

			try {
				if (_.some(notes.getNotes(), (note) => note.title === title)) {
					console.log('Note already exists');
					return;
				}
				notes.addNote(title, body);
				console.log('Note added successfully');
			} catch (error) {
				reportStorageError(error);
			}
		})
	.command('list', 'List all notes', () => {}, () => {
		try {
			const allNotes = notes.getNotes();
			if (allNotes.length === 0) {
				console.log('No notes found');
				return;
			}

			console.log('Your notes:');
			allNotes.forEach((note) => console.log(`- ${note.title}: ${note.body}`));
		} catch (error) {
			reportStorageError(error);
		}
	})
	.command('read', 'Read a note', (command) => command
		.option('title', { type: 'string', demandOption: true, describe: 'Note title' }), (args) => {
			try {
				const note = notes.getNote(args.title.trim());
				if (!note) {
					console.log('Note not found');
					return;
				}
				console.log(`Title: ${note.title}\n${note.body}`);
			} catch (error) {
				reportStorageError(error);
			}
		})
	.command('remove', 'Remove a note', (command) => command
		.option('title', { type: 'string', demandOption: true, describe: 'Note title' }), (args) => {
			try {
				if (!notes.removeNote(args.title.trim())) {
					console.log('Note not found');
					return;
				}
				console.log('Note removed successfully');
			} catch (error) {
				reportStorageError(error);
			}
		})
	.demandCommand(1, 'command not recognized')
	.strictCommands()
	.fail((message, error) => {
		if (error) throw error;
		console.error(message.startsWith('Unknown command:') ? 'command not recognized' : message);
		process.exitCode = 1;
	})
	.help()
	.parse();

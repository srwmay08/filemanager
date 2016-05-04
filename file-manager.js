var fs = require('fs');

var isDeletingFile = false;

var useStdin = function() {
	var input = process.stdin.read();
	if (input !== null) {
		var inputSplit = input.toString().trim().split(" ");
		console.log(isDeletingFile);
		if (isDeletingFile) {
			if (inputSplit[0] == "y") {
				reallyDeleteFile(fileToDelete);
			} else {
				isDeletingFile = false;
				console.log("File not deleted");
			}
		} else {
			if (inputSplit[0] == "cat") {
				//cat <filename>
				catFile(inputSplit[1]);
			} else if (inputSplit[0] == "touch") {
				//touch <filename>
				createNewFile(inputSplit[1]);
			} else if (inputSplit[0] == "rm") {
				//rm <filename>
				deleteFile(inputSplit[1]);
			} else if (inputSplit[0] == "replace") {
				//replace <filename> <word to replace> <replacement word>
				replaceFile(inputSplit[1], inputSplit[2], inputSplit[3]);
			} else if (inputSplit[0] == "grep") {
				//grep <filename> <word to replace> <replacement word>
				grepFile(inputSplit[1], inputSplit[2]);
			}
		}

	}
};



//create a file (touch)
function createNewFile(fileName) {
	fs.writeFile(fileName, "", function(err){
		if (err) {
			console.log("Could not write to file");
		} else {
			console.log("File created and saved");
		}
	});
}
//read from a file (cat)
function catFile(fileName) {
	fs.readFile(fileName, function(err, data) {
		if (err) {
			console.log("Unable to read from file");
		} else {
			console.log(data.toString());
		}
	});
}

//delete a file (rm)
function deleteFile(fileName) {
	console.log("Really? (y/n)");
	fileToDelete = fileName;
	isDeletingFile = true;
}

function reallyDeleteFile(fileName) {
	isDeletingFile = false;
	fileToDelete = "";
	fs.unlink(fileName, function(err) {
		if (err) {
			console.error("Error!");
			return;
		} else {
		console.log("File deleted successfully!");
		}
		
	});
}



function replaceFile(fileName, searchText, replaceText) {
	fs.readFile(fileName, 'utf8', function(err, data) {
    if (err) {
      return console.log(err);
    }
     
    var result = data.split(searchText).join(replaceText);
    fs.writeFile(fileName, result, 'utf8', function(err) {
        if (err) {
           return console.log(err);
        };
    });
});
}

function grepFile(fileName, searchText) {
	fs.readFile(fileName, 'utf8', function(err, data) {
		
		// ERROR SPACING
		
		var result = data.split("\n");		
		
		
		for (i = 0; i < result.length; i++){
			if (result[i].indexOf(searchText) != -1) {
				console.log("Line " + (i+1) + ": " + result[i]);
			}
		}
		
			
	});
	
}


process.stdin.on('readable', useStdin);

/*
Your assignment is to implement the following functionality:
	* remove a file
		"rm" <file name>
		> rm hello.txt
			entirely delete the file hello.txt

	* find and replace a word in the file
		"replace" <file to search> <word to replace> <replacement word>
		> replace hello.txt hello goodbye
			replace all instances of hello in hello.txt with goodbye
		> replace what.txt there their
			replace all instances of there in what.txt with their

	* find a line in a file
		"grep" <file name> <word to find>
		> grep hello.txt hello
			print out all of the lines in hello.txt that contain "hello"
		> grep what.txt there
			print out all of the lines in what.txt that contain "there"

	Bonus work:
		* Ask for confirmation before deleting a file
		* Don't let people delete files that are above the current working directory (i.e. disallow "../")
		* Have grep take a regular expression as the word to find
		* Create mkdir and rmdir
*/


//TODO: Maybe multiple tapes

$(document).ready(function(){
console.log("ready");
	$("#submit").click(function(){
		console.log("clicked");
		var code = $("#code").val();
		var input = $("#input").val();
		var output = interpret(code,input);
		document.getElementById("output").value = output;
	});
});

function interpret(instructions,input){
	//The tape
	var tape = new Array();
	//fill it with 0's
	var tape_length = 1000;
	for (var i=0;i<tape_length;i++){
		tape[i] = 0;
	}
	//does the tape wrap or not, not implemented
	wrapping = false;
	var outputStream = []; //Output to be built
	
	var inputPointer = 0;//pointer on input stream, moves L to R, one way
	var tapePointer = 0; //pointer on the tape
	var instructionPointer = 0;//pointer on the instructions
	input = input.trim();
	var input_array = input.split('');

	//remove whitespace
	instructions = instructions.replace(/ /g, "");
	instructions = instructions.trim();

	//remove all non valid chars
	instructions = instructions.replace(/[^,-<>\.\+\[\]]|[\d\\\/]/gi, "")//so elegant
	console.log(instructions);
	var instruction_array = instructions.split('');

	console.log("instructions array: " + instruction_array + " "+instruction_array.length);
	console.log()
	//while loop through instructions
	while(instructionPointer < instruction_array.length ){ 
		console.log("READING IN INSTRUCTION "+ instruction_array[instructionPointer]);
		switch(instruction_array[instructionPointer]){
			case '>': //make chars variables, so can do other "languages"
				if(tapePointer<tape_length-1){
					tapePointer++;
					console.log("Tape pos incremeneted to "+ tapePointer);
					instructionPointer++;
					break;
				}
				else{
					// return("Error: Cannot increment tape into past max tape length of " + tape_length);
					return("Error: Cannot increment tape into past max tape length of " + tape_length);
				}
			case '<':
				console.log(tapePointer);
				if(tapePointer>0){
					tapePointer--;
					console.log("Tape pos decremented to "+ tapePointer);
					instructionPointer++;
					break;
				}
				else{
					return("Error: Cannot decrement tape into negative value");
				}
			case '+':
				tape[tapePointer]++;
				console.log("Tape at "+tapePointer+ " value incremented to "+tape[tapePointer]);
				instructionPointer++;
				break;
			case '-':
				if(tape[tapePointer] > 0){
					tape[tapePointer]--;
					console.log("Tape at "+tapePointer+ " value decremented to "+tape[tapePointer]);
					instructionPointer++;
					break;
				}
				else{
					return("Error: Cannot store negative value on tape");
				}
			case '.':
				outputStream+=String.fromCharCode(tape[tapePointer]);
				//outputStream+=tape[tapePointer];
				console.log("adding "+String.fromCharCode(tape[tapePointer])+ " to outsteam");
				instructionPointer++;
				break;
			case ',':
				console.log("read in "+input_array[inputPointer] + " as "+ input_array[inputPointer].charCodeAt(0))
				tape[tapePointer] = input_array[inputPointer].charCodeAt(0);//error catching for to many reads
				instructionPointer++;
				inputPointer++;
				break;
			case '[': //error catching if no matching
				if(tape[tapePointer] == 0){
					var foundMatching = false;
					var nesting_levels = 0;
					for (var i=instructionPointer+1; i<instruction_array.length-1; i++){
						console.log('scanning foward to pos '+ i);
						if(instruction_array[i] == '['){
							nesting_levels++;
						}
						if(instruction_array[i] == ']' && !foundMatching && nesting_levels == 0){
							console.log('found matching ] brace at '+ i);
							instructionPointer = i+1;
							foundMatching = true;
							break;
						}
						else if(instruction_array[i] == ']' && !foundMatching && nesting_levels > 0){ ///redundant for clarities sake
							nesting_levels--;
						}
					}
					if(!foundMatching){
						return("Error: Expected matching ] for char " + tapePointer + " and instructionPointer at "+ instructionPointer);
					}
				}
				else{
					instructionPointer++;
					break;
				}
			case ']':
				if(tape[tapePointer] != 0){
					var foundMatching = false;
					var nesting_levels = 0;
					for(var i=instructionPointer-1; i > -1; i--){
						console.log('scanning back to pos '+ i);
						if(instruction_array[i] == ']'){
							nesting_levels++;
						}
						if(instruction_array[i] == '[' && !foundMatching && nesting_levels == 0){
							console.log('found matching [ brace at '+ i);
							instructionPointer = i+1;
							foundMatching = true;
							break;
						}
						else if(instruction_array[i] == '[' && !foundMatching && nesting_levels > 0){
							nesting_levels--;
						}
					}
					if(!foundMatching){
						return("Error: Expected matching [ for char " + tapePointer + " and instructionPointer at "+ instructionPointer);
					}
				}
				else{
					instructionPointer++;
					break;
				}
			default:
				console.log("comment char")
				break;
		}
	}
	console.log("outputstream: "+outputStream + " from location "+ tapePointer);
	return outputStream;
}
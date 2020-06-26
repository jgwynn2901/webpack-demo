import _ from 'lodash';
import $ from 'jquery';
import 'bootstrap';
import setFontSize from './components/setFontSize';
const ko = require ('knockout');
const roosterjs = require('roosterjs');

// set up globals hack.
window.$ = $;
window.ko = ko;
window._ = _;

const testData = "What is needed: We need the ability to format text in the areas of Select Intake Greeting, Location Lookup InstructionsEmployee Lookup Instructions, and Vehicle Lookup Instructions. At a minimum, the following formatting options are needed: Bold, Font Size, Underline, and Break (going to the next line using the enter  It would be ideal to have a formatting tool, such as the mockup below, but we can also use the same formatting techniques that are available to us in View Logic.";
const fontSizeList = ["","increase", "decrease"];
export default function start() {
  console.log( "ready!" );
};

$(document).ready(function() {
  	const source = document.getElementById('source');
  	const editorDiv = document.getElementById('editorDiv');
  	const editor = roosterjs.createEditor(editorDiv);
  	const fontSizeSelect = $("#font_size_list");
  
    source.innerText = testData;
	fontSizeSelect.hide();
  
  	$("#edit_button").on("click", (e) => {
    	e.preventDefault();
    	$("#formatTexteModal").modal('show');
  	});

 	editor.setContent(testData);
 	document.getElementById('bold').addEventListener('click', function () {
    	roosterjs.toggleBold(editor);
    	toggleChecked(this, roosterjs.getFormatState(editor).isBold);
 	});
 	document.getElementById('italic').addEventListener('click', function () {
 		roosterjs.toggleItalic(editor); 
     	toggleChecked(this, roosterjs.getFormatState(editor).isItalic);
    });
	document.getElementById('underline').addEventListener('click', function () {
    	roosterjs.toggleUnderline(editor);
    	toggleChecked(this, roosterjs.getFormatState(editor).isUnderline);
  	});
  	document.getElementById('font_up').addEventListener('click', function () {
    	onSetFont(0)
      });
    document.getElementById('font_down').addEventListener('click', function () {
    	onSetFont(1)
  	});

	function onShowDropDown(element, button) {
    	let me = $(element);
    	$(button).prop('disabled', true);
    	me.show();
  	};

  	function onSetFont(direction) {
    	roosterjs.changeFontSize(editor, direction);   
  	};

	function model(inst, fsize) {
    	var self = this;
    	self.locationInstruction = ko.observable(inst);
    	self.listItems = ko.observableArray(fsize);
    	self.updateInstruction = function(instr) {
      		self.locationInstruction(instr);
    	};
  	};
  
  	function toggleChecked(button, isChecked)  {
    	if(isChecked) {
      		$(button).addClass('checked');
    	} else {
      		$(button).removeClass('checked');    
    	}
  	};
  	
    var viewModel = new model(testData, fontSizeList);
    ko.applyBindings(viewModel ); 
    
    fontSizeSelect.change((e) => {
        let me = $(e.currentTarget);
        let css_size = me.val();
        if(css_size) { 
            let direction = css_size == "increase" ? 0 : 1;         
            console.log(direction);
            roosterjs.changeFontSize(editor, direction);   
        }
        onHideDropDown(me);
    });

    
    $("#saveButton").on("click", (e) => {
        e.preventDefault();
        viewModel.updateInstruction(editorDiv.innerHTML);
        $("#formatTexteModal").modal('hide');
    });
  	start();
});


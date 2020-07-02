import $ from "jquery";
import "bootstrap";
const ko = require("knockout");
const roosterjs = require("roosterjs");

// set up globals hack.
window.$ = $;
window.ko = ko;

const testData =
  "What is needed: We need the ability to format text in the areas of Select Intake Greeting, Location Lookup InstructionsEmployee Lookup Instructions, and Vehicle Lookup Instructions. At a minimum, the following formatting options are needed: Bold, Font Size, Underline, and Break (going to the next line using the enter  It would be ideal to have a formatting tool, such as the mockup below, but we can also use the same formatting techniques that are available to us in View Logic.";

const checked = 'checked';

export default function start() {
  console.log("y'all ready for this!");
}

$(document).ready(function() {
  const editorDiv = document.getElementById("editorDiv");
  const editor = roosterjs.createEditor(editorDiv);

  $("#edit_button").on("click", (e) => {
    e.preventDefault();
    $("#formatTexteModal").modal("show");
  });

  $("#ribbon").on("click", function (e) {
    e.preventDefault();
    if (e.target != e.currentTarget) {
      const targetButton = e.target.parentElement;
      switch (targetButton.id) {
        case "bold":
          roosterjs.toggleBold(editor);
          break;
        case "italic":
          roosterjs.toggleItalic(editor);
          break;
        case "underline":
          roosterjs.toggleUnderline(editor);
          break;
        case "font_up":
          onSetFont(0);
          break;
        case "font_down":
          onSetFont(1);
          break;
        case "bullet":
          roosterjs.toggleBullet(editor);
          break;
        case "numbering":
          roosterjs.toggleNumbering(editor);
          break;
        case "indent":
          onSetIndent(0);
          break;
        case "outdent":
          onSetIndent(1);
          break;
        case "superscript":
          roosterjs.toggleSuperscript(editor);
          break;  
        case "subscript":
          roosterjs.toggleSubscript(editor);
          break;    
        case "strikethrough":
          roosterjs.toggleStrikethrough(editor);
          break;  
          case "undo":
            editor.undo();
            break;
          case "redo":
            editor.redo();
            break;
      }
    }updateButtons();
  });
  
  function onSetFont(direction) {
    roosterjs.changeFontSize(editor, direction);
  }

  function onSetIndent(direction) {
    roosterjs.setIndentation(editor, direction);
  }

  function model(inst) {
    var self = this;
    self.LocationInstruction = ko.observable(inst);
    self.Greeting = ko.observable("Greeting");
    self.EmployeeInstruction = ko.observable("Employee Instruction");
    self.VehicleInstruction = ko.observable("Vehicle Instruction");
    self.target = "";
    self.updateInstruction = function(text) {
      console.log('update ' + self.target.id)
      switch (self.target.id) {
        case "Location-tab":
          self.LocationInstruction(text);
          break;
        case "Employee-tab":
          self.EmployeeInstruction(text);
          break;
        case "Greetings-tab":
          self.Greeting(text);
          break;
        case "Vehicle-tab":
          self.VehicleInstruction(text);
          break;
      } 
    };
  }

  var viewModel = new model(testData);
  ko.applyBindings(viewModel);

  function updateButtons () { //TODO: this is a function of the editor state not the button events
    roosterjs.getFormatState(editor).isBold ?
      $('#bold').addClass(checked) : $('#bold').removeClass(checked);

    roosterjs.getFormatState(editor).isUnderline ?
      $('#underline').addClass(checked) : $('#underline').removeClass(checked);
      
    roosterjs.getFormatState(editor).isItalic ?
      $('#italic').addClass(checked) : $('#italic').removeClass(checked);

    
  }

  function getContent(id) {
    switch(id) {
      case "Greetings-tab":
        return viewModel.Greeting();
      case "Location-tab":
        return viewModel.LocationInstruction();  
      case "Employee-tab":
        return viewModel.EmployeeInstruction();
      case "Vehicle-tab":
        return viewModel.VehicleInstruction();  
    }
  }

  function setContent(id, data) {
    switch(id) {
      case "Greetings-tab":
        viewModel.Greeting(data);
        break;
      case "Location-tab":
        viewModel.LocationInstruction(data);
        break;  
      case "Employee-tab":
        viewModel.EmployeeInstruction(data);
        break;
      case "Vehicle-tab":
        viewModel.VehicleInstruction(data);
        break;  
    }
  }

  $("#nav-tabs").on("click", function (e) {
    e.preventDefault();
    if (e.target != e.currentTarget) {
      viewModel.target = e.target.id || e.target.parentNode.id;
      editor.setContent(getContent(viewModel.target));
      let modalTitle = viewModel.target.split('-')[0];
      if (modalTitle != "Greetings") {
        modalTitle += " Lookup";
      }
      modalTitle += " Instructions";
      document.getElementById('modalLongTitle').innerHTML = modalTitle;
      $("#formatTexteModal").modal("show");

    }
  });
  
  $("#saveButton").on("click", (e) => {
    e.preventDefault();
    console.log('saving to ' + viewModel.target);
    setContent(viewModel.target, editorDiv.innerHTML);
    $("#formatTexteModal").modal("hide");
  });
  start();
});

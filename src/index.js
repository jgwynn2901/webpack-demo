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
      }
    }updateButtons();
  });

  

  function onSetFont(direction) {
    roosterjs.changeFontSize(editor, direction);
  }

  function model(inst) {
    var self = this;
    self.LocationInstruction = ko.observable(inst);
    self.Greeting = ko.observable("<em>Greeting</em>");
    self.EmployeeInstruction = ko.observable("<b>Employee</b> Instruction");
    self.VehicleInstruction = ko.observable("<i>Vehicle</i> Instruction");
    self.target = "";
    self.updateInstruction = function(text) {
        switch (self.target.id) {
          case "location-tab":
            self.LocationInstruction(text);
            break;
          case "employee-tab":
            self.EmployeeInstruction(text);
            break;
          case "greeting-tab":
            self.Greeting(text);
            break;
          case "vehicle-tab":
            self.VehicleInstruction(text);
            break;
        } 
    };
  }

  function toggleChecked(button, isChecked) {
    let $b = $("#" + button);
    console.log(button, isChecked);
    if (isChecked) {
      if(!$b.hasClass(checked)) {
        $b.addClass(checked);
      }
    } else {
        $b.removeClass(checked);
    }
  }

  var viewModel = new model(testData);
  ko.applyBindings(viewModel);

  function updateButtons () {
    roosterjs.getFormatState(editor).isBold ?
      $('#bold').addClass(checked) : $('#bold').removeClass(checked);

    roosterjs.getFormatState(editor).isUnderline ?
      $('#underline').addClass(checked) : $('#underline').removeClass(checked);
      
    roosterjs.getFormatState(editor).isItalic ?
      $('#italic').addClass(checked) : $('#italic').removeClass(checked);
  }

  function getContent(id) {
    switch(id) {
      case "greeting-tab":
        return viewModel.Greeting();
      case "location-tab":
        return viewModel.LocationInstruction();  
      case "employee-tab":
        return viewModel.EmployeeInstruction();
      case "vehicle-tab":
        return viewModel.VehicleInstruction();  
    }
  }

  function setContent(id, data) {
    switch(id) {
      case "greeting-tab":
        viewModel.Greeting(data);
        break;
      case "location-tab":
        viewModel.LocationInstruction(data);
        break;  
      case "employee-tab":
        viewModel.EmployeeInstruction(data);
        break;
      case "vehicle-tab":
        viewModel.VehicleInstruction(data);
        break;  
    }
  }

  $("#nav-tabs").on("click", function (e) {
    e.preventDefault();
    if (e.target != e.currentTarget) {
      viewModel.target = e.target.id;
      editor.setContent(getContent(e.target.id));
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

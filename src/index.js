import $ from "jquery";
import "bootstrap";
import setFontSize from "./components/setFontSize";
const ko = require("knockout");
const roosterjs = require("roosterjs");

// set up globals hack.
window.$ = $;
window.ko = ko;

const testData =
  "What is needed: We need the ability to format text in the areas of Select Intake Greeting, Location Lookup InstructionsEmployee Lookup Instructions, and Vehicle Lookup Instructions. At a minimum, the following formatting options are needed: Bold, Font Size, Underline, and Break (going to the next line using the enter  It would be ideal to have a formatting tool, such as the mockup below, but we can also use the same formatting techniques that are available to us in View Logic.";

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
          toggleChecked(targetButton, roosterjs.getFormatState(editor).isBold);
          break;
        case "italic":
          roosterjs.toggleItalic(editor);
          toggleChecked(targetButton, roosterjs.getFormatState(editor).isItalic);
          break;
        case "underline":
          roosterjs.toggleUnderline(editor);
          toggleChecked(targetButton, roosterjs.getFormatState(editor).isUnderline);
          break;
        case "font_up":
          onSetFont(0);
          break;
        case "font_down":
          onSetFont(1);
          break;
      }
    }
  });

  function onSetFont(direction) {
    roosterjs.changeFontSize(editor, direction);
  }

  function model(inst) {
    var self = this;
    self.LocationInstruction = ko.observable(inst);
    self.Greeting = ko.observable("Greeting");
    self.EmployeeInstruction = ko.observable("Employee Instruction");
    self.VehicleInstruction = ko.observable("Vehicle Instruction");
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
    let $b = $(button);
    const checked = 'checked';
    if (isChecked) {
      if(!$b.hasClass(checked)) {
        $b.addClass("checked");
      }
    } else {
      if(!$b.hasClass(checked)) {
        $b.removeClass("checked");
      }
    }
  }

  var viewModel = new model(testData);
  ko.applyBindings(viewModel);

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

  $("#nav-tabs").on("click", function (e) {
    e.preventDefault();
    if (e.target != e.currentTarget) {
      viewModel.target = e.target.id;
      console.log(e.target.id);
      editor.setContent(getContent(e.target.id));
      $("#formatTexteModal").modal("show");
    }
  });
  
  $("#saveButton").on("click", (e) => {
    e.preventDefault();
    viewModel.updateInstruction(editorDiv.innerHTML);
    $("#formatTexteModal").modal("hide");
  });
  start();
});

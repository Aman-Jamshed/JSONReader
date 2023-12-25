document.addEventListener("DOMContentLoaded", function () {
  var fileInput = document.getElementById("fileInput");
  var dataBlock = document.querySelector(".dataBlock");
  var jsonOutput = document.getElementById("jsonOutput");
  var formatJSONBtn = document.getElementById("formatJSON");
  var addBlockBtn = document.getElementById("addBlock");
  var deleteBlockBtn = document.getElementById("deleteBlock");
  var clearDataBtn = document.getElementById("clearData");
  var saveFileBtn = document.getElementById("saveFile");
  var deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
  var confirmDeleteBtn = document.getElementById("confirmDelete");
  var saveAlert = document.getElementById("saveAlert");

  // Handle file input change event
  fileInput.addEventListener("change", function () {
    var file = fileInput.files[0];
    if (file) {
      var reader = new FileReader();
      reader.onload = function (e) {
        dataBlock.textContent = e.target.result;
      };
      reader.readAsText(file);
    }
  });

  // Handle Format JSON button click
  formatJSONBtn.addEventListener("click", function () {
    try {
      var jsonData = JSON.parse(dataBlock.textContent);
      jsonOutput.textContent = JSON.stringify(jsonData, null, 2);
    } catch (error) {
      alert("Invalid JSON data. Please check your input.");
    }
  });

  // Handle Add Block button click
  addBlockBtn.addEventListener("click", function () {
    var currentContent = dataBlock.textContent;
    var blockId = "block_" + Date.now();
    dataBlock.textContent =
      currentContent + '\n{"' + blockId + '": "New Block Content"}';
  });

  // Handle Delete Block button click
  deleteBlockBtn.addEventListener("click", function () {
    var currentContent = dataBlock.textContent;

    try {
      var jsonData = JSON.parse(currentContent);
      var blockIds = Object.keys(jsonData);

      if (blockIds.length === 0) {
        alert("No blocks to delete.");
        return;
      }

      var lastBlockId = blockIds[blockIds.length - 1];
      if (lastBlockId.startsWith("block_")) {
        delete jsonData[lastBlockId];
      } else {
        deleteModal.show();
        document.querySelector("#deleteModal .modal-body").textContent =
          jsonData[lastBlockId];
        confirmDeleteBtn.setAttribute("data-block-id", lastBlockId);
      }

      dataBlock.textContent = JSON.stringify(jsonData, null, 2);
    } catch (error) {
      alert("Invalid JSON data. Please check your input.");
    }
  });

  // Handle Confirm Delete button click
  confirmDeleteBtn.addEventListener("click", function () {
    var blockIdToDelete = confirmDeleteBtn.getAttribute("data-block-id");

    var currentContent = dataBlock.textContent;

    var jsonData = JSON.parse(currentContent);

    delete jsonData[blockIdToDelete];
    dataBlock.textContent = JSON.stringify(jsonData, null, 2);
    deleteModal.hide();
  });

  // Handle Clear Data button click
  clearDataBtn.addEventListener("click", function () {
    dataBlock.textContent = "";
    jsonOutput.textContent = "";
  });

  // Handle Save File button click
  saveFileBtn.addEventListener("click", function () {
    var currentContent = dataBlock.textContent;
    try {
      var jsonData = JSON.parse(currentContent);
      var jsonString = JSON.stringify(jsonData, null, 2);
      var blob = new Blob([jsonString], { type: "application/json" });
      var downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = "updated_data.json";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      saveAlert.style.display = "block";
      setTimeout(function () {
        saveAlert.style.display = "none";
      }, 3000);
    } catch (error) {
      alert("Invalid JSON data. Unable to save the file.");
    }
  });
});

document.addEventListener('DOMContentLoaded', function () {
    const burgerMenu = document.querySelector('.burger-menu');
    const navList = document.querySelector('.nav-list');
  
    burgerMenu.addEventListener('click', function () {
      navList.classList.toggle('show');
    });
  });

  
  // Add this to your existing script.js or create a new one

function updateProgressBar() {
    var percentage = document.getElementById('percentageInput').value;
  
    if (percentage >= 0 && percentage <= 100) {
      var progressBar = document.getElementById('myProgressBar');
      progressBar.style.width = percentage + '%';
    } else {
      alert('Please enter a percentage between 0 and 100.');
    }
  }

  
 // Add this to script.js

document.addEventListener('DOMContentLoaded', function () {
    updateSkillBarColors();
    addSmoothScrolling();
    addMobileNavigation();
  });
  
  function updateSkillBarColors() {
    var skillBars = document.querySelectorAll('.progress');
  
    skillBars.forEach(function (bar) {
      var percent = parseInt(bar.style.width);
      if (percent >= 80) {
        bar.style.backgroundColor = '#2ecc71'; // Green
      } else if (percent >= 50) {
        bar.style.backgroundColor = '#3498db'; // Blue
      } else {
        bar.style.backgroundColor = '#e74c3c'; // Red
      }
    });
  }
  
  function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
  
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        });
      });
    });
  }
  
  function addMobileNavigation() {
    var mobileNavButton = document.getElementById('mobile-nav-button');
    var navList = document.getElementById('nav-list');
  
    mobileNavButton.addEventListener('click', function () {
      navList.classList.toggle('show');
    });
  }

  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  function submitForm() {
    // Add your form submission logic here
    // You can use AJAX or any other method to send the form data
    alert('Form submitted successfully!');
    document.getElementById('contactForm').reset();
  }

  
  // JavaScript functions or interactions go here

function submitForm() {
  // Add your form submission logic here
  // You can use AJAX to send the form data to the server
  alert('Form submitted!'); // Replace this with your actual submission logic
}


// script.js
document.addEventListener('DOMContentLoaded', function () {
  const navLinks = document.querySelectorAll('.nav-list a');

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      window.scrollTo({
        top: targetElement.offsetTop - document.querySelector('header').offsetHeight,
        behavior: 'smooth',
      });
    });
  });
});

// The default sheet name is 'Sheet1'. To target a different sheet, update this variable.
var sheetName = 'Sheet1'

/*
Gets a property store that all users can access, but only within this script.
https://developers.google.com/apps-script/reference/properties/properties-service#getScriptProperties()
*/
var scriptProp = PropertiesService.getScriptProperties()

/*
This is the initial setup function. It gets the active SpreadsheetApp ID and adds it to our PropertiesService.
https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app#getactivespreadsheet
*/
function setup () {
  var doc = SpreadsheetApp.getActiveSpreadsheet()
  scriptProp.setProperty('key', doc.getId())
}

function doPost (e) {
  /*
  Gets a lock that prevents any user from concurrently running a section of code. A code section
  guarded by a script lock cannot be executed simultaneously regardless of the identity of the user.
  https://developers.google.com/apps-script/reference/lock/lock-service#getScriptLock()
  */
  var lock = LockService.getScriptLock()

  /*
  Attempts to acquire the lock, timing out with an exception after the provided number of milliseconds.
  This method is the same as tryLock(timeoutInMillis) except that it throws an exception when the lock
  could not be acquired instead of returning false.
  https://developers.google.com/apps-script/reference/lock/lock#waitLock(Integer)
  */
  lock.waitLock(10000)

  try {
    /*
    Opens the spreadsheet with the given ID. A spreadsheet ID can be extracted from its URL. For example,
    the spreadsheet ID in the URL https://docs.google.com/spreadsheets/d/abc1234567/edit#gid=0 is "abc1234567".
    https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app#openbyidid
    */
    var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))

    /*
    Returns a sheet with the given name. If multiple sheets have the same name,
    the leftmost one is returned. Returns null if there is no sheet with the given name.
    https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet#getSheetByName(String)
    */
    var sheet = doc.getSheetByName(sheetName)

    /*
    Returns the range with the top left cell at the given coordinates, and with the given number of rows.
    https://developers.google.com/apps-script/reference/spreadsheet/sheet#getRange(Integer,Integer)

    Then returns the position of the last column that has content.
    https://developers.google.com/apps-script/reference/spreadsheet/sheet#getlastcolumn

    Then returns the rectangular grid of values for this range (a two-dimensional array of values, indexed by row, then by column.)
    https://developers.google.com/apps-script/reference/spreadsheet/range#getValues()
    */
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    // Gets the last row and then adds one
    var nextRow = sheet.getLastRow() + 1

    /*
    Maps the headers array to a new array. If a header's value is 'timestamp' then it
    returns a new Date() object, otherwise it returns the value of the matching URL parameter
    https://developers.google.com/apps-script/guides/web
    */
    var newRow = headers.map(function(header) {
      return header === 'timestamp' ? new Date() : e.parameter[header]
    })

    /*
    Gets a range from the next row to the end row based on how many items are in newRow
    then sets the new values of the whole array at once.
    https://developers.google.com/apps-script/reference/spreadsheet/range#setValues(Object)
    */
    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow])

    /*
    Return success results as JSON
    https://developers.google.com/apps-script/reference/content/content-service
    */
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  /*
  Return error results as JSON
  https://developers.google.com/apps-script/reference/content/content-service
  */
  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  finally {
    /*
    Releases the lock, allowing other processes waiting on the lock to continue.
    https://developers.google.com/apps-script/reference/lock/lock#releaseLock()
    */
    lock.releaseLock()
  }
}

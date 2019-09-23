var NO_DIFFERENCE = ""

/**
 * Asserts "expected" versus "actual", 
 * 'failing' the assertion (via Error) if a difference is found.
 *
 * @param {String} message The comparison message passed by the user
 * @param {*} expected The expected item
 * @param {*} actual The actual item
 */

function assertEquals(message, expected, actual) { 

  function extractType(item) {
    return Object.prototype.toString.call(item).split(" ")[1].replace(/]/g,"");
  }
  
  var expectedType = extractType(expected);
  var actualType = extractType(actual);
  
  if ( expected == actual ) {
    return true;
  } 
    
  else if (expectedType !== actualType) {
    throw({message: message + "Expected type " + expectedType + " but found " + actualType});
  }
  
  else if (typeof expected === 'string' || expected instanceof String) {
    throw({message: message + "Expected \"" + expected + "\" found \"" + actual + "\""});
  }
  
  else if (typeof expected === 'object' && expected.constructor === Array ) {
    handleArrayDiff(message, expected, actual);
  }
    
  else {
    var response = findDifference(expected, actual)
    // If a difference is found, return the response.
    if (response !== NO_DIFFERENCE) {
      throw({message: message + "Expected at " + response})
  }   
 }
}


/**
 * Compares "item1" versus "item2", 
 * if a difference is found, returns a response of the difference.
 *  
 * @param {*} item1 The first item to compare
 * @param {*} item2 The second item to compare against item1
 */

function findDifference( item1, item2 ) {  
  // Iterate over item1 and do following checks:
  for (var e in item1) {
    var expectedKey = e
    var expectedVal = item1[e]
    var actualVal = item2[e]
     
    // Check if item2 properties exists in item1
    if ( !item2.hasOwnProperty(e) ) {
      return " but was not found";
    }
      
    // If item1 and item2 have the same strict value then they are equal so continue
    else if ( expectedVal === actualVal ) {
      continue;
    } 
    
    // If the type of expectedVal is not equal to object, return where the difference is
    else if ( typeof(expectedVal ) !== "object" ) {
      return expectedKey + " " + "\"" + expectedVal + "\" but found \"" + actualVal + "\"";
    }
    
    // For nested Objects or Arrays, test recursively until we find the difference
    var msg = findDifference( expectedVal,  actualVal); 
    
    if ( msg.length > 0 ) 
      return e + "." + msg;
  }
  
  // If nothing failed, return noDifference
  return NO_DIFFERENCE;
}

/**
 * Checks the length of two different arrays, 
 * if the length is different, throw the error message with a specific response.
 * Otherwise, call handleDiffResponse() to check if there is a difference between arrays, 
 * if a difference is found, throw the error message with the specific response.
 *
 * @param {String} message The comparison message passed by the user
 * @param {*} expected The first item to compare
 * @param {*} actual The second item to compare
 */

function handleArrayDiff(message, expected, actual) {
  if (expected.length !== actual.length) {
    throw({message: message + "Expected array length " + expected.length + " but found " + actual.length})
  } else {
    var response = findDifference(expected, actual)
    // If a difference is found, return the response.
    if (response !== NO_DIFFERENCE) {
      throw({message: message + "Expected at " + response})
    }       
  }
}


/* -- Test running code:  --- */

/**
 * Runs a "assertEquals" test.
 * 
 * @param {String} message The initial message to pass
 * @param {Array} assertionFailures List of messages that will be displayed on the UI for evaluation
 * @param {*} expected Expected item
 * @param {*} actual The actual item
 */

function runTest(message, assertionFailures, expected, actual) {
  try {
    assertEquals(message, expected, actual);
  } catch (failure) {
    assertionFailures.push(failure.message);
  }
}

function runAll() {
  
  var complexObject1 = {
    propA: 1,
    propB: {
      propA: [1, { propA: 'a', propB: 'b' }, 3],
      propB: 1,
      propC: 2
    }
  };
  var complexObject1Copy = {
    propA: 1,
    propB: {
      propA: [1, { propA: 'a', propB: 'b' }, 3],
      propB: 1,
      propC: 2
    }
  };
  var complexObject2 = {
    propA: 1,
    propB: {
      propB: 1,
      propA: [1, { propA: 'a', propB: 'c' }, 3],
      propC: 2
    }
  };
  var complexObject3 = {
    propA: 1,
    propB: {
      propA: [1, { propA: 'a', propB: 'b' }, 3],
      propB: 1
    }
  };
  

  // Run the tests
  var assertionFailures = [];
  runTest('Test 01: ', assertionFailures, 'abc', 'abc');
  runTest('Test 02: ', assertionFailures, 'abcdef', 'abc');
  runTest('Test 03: ', assertionFailures, ['a'], {0: 'a'});
  runTest('Test 04: ', assertionFailures, ['a', 'b'], ['a', 'b', 'c']);
  runTest('Test 05: ', assertionFailures, ['a', 'b', 'c'], ['a', 'b', 'c']);
  runTest('Test 06: ', assertionFailures, complexObject1, complexObject1Copy);
  runTest('Test 07: ', assertionFailures, complexObject1, complexObject2);
  runTest('Test 08: ', assertionFailures, complexObject1, complexObject3);
  runTest('Test 09: ', assertionFailures, ['a', 'b', 'c'], ['c', 'd', 'e']);
  runTest('Test 10: ', assertionFailures, [2, 3, 4], [2, 3, 5]);
  runTest('Test 11: ', assertionFailures, null, {});
  runTest('Test 12: ', assertionFailures, null, 10);
  runTest('Test 13: ', assertionFailures, 10, 10);
  runTest('Test 14: ', assertionFailures, [10], 10);
  runTest('Test 15: ', assertionFailures, 10, 'abc');
  runTest('Test 16: ', assertionFailures, true, (1 + 1));
  
  // Output the results
  var messagesEl = document.getElementById('messages');
  var newListEl;
  var i, ii;
  
  for (i = 0, ii = assertionFailures.length; i < ii; i++) {    
    newListEl = document.createElement('li');
    newListEl.innerHTML = assertionFailures[i];
    messagesEl.appendChild(newListEl);    
  }
}

runAll();

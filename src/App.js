import React, { useState, useEffect, useRef } from 'react';
import SplitPane, { Pane } from 'react-split-pane';
import { Button, TextField, Typography, Box } from '@mui/material';
import StringSimilarity from 'string-similarity';





import './App.css';



// A function to check if the copied code is within 90% Levenshtein distance of the original code
function checkCode(originalCode, copiedCode, peeks, seconds)
{
  originalCode = originalCode.replace(/\s/g, '').toLowerCase();
  copiedCode = copiedCode.replace(/\s/g, '').toLowerCase();

  // Use string-similarity to get the similarity ratio
  var ratio = StringSimilarity.compareTwoStrings(originalCode, copiedCode);
  if (ratio >= 0.8)
  {
    alert("You have successfully copied the code with " + peeks + " peeks and "  + seconds + " seconds!" );
    
    window.location.reload();
    return true;
  } else
  {
    alert("Your code is not close enough. Please try again.");
    return false;
  }
}

// A function to show the original code for 5 seconds and increment the number of peeks
function peekCode(setPeeks, setShowOriginal)
{
  setPeeks((peeks) => peeks + 1);
  setShowOriginal(true);
  setTimeout(() =>
  {
    setShowOriginal(false);
  }, 5000);
}

// The original code to copy
const originalCode = `# A python program to print the Fibonacci sequence
def fibonacci(n):
    a = 0
    b = 1
    for i in range(n):
        print(a, end=" ")
        a, b = b, a + b
    print()

# Ask the user for the number of terms
n = int(input("Enter the number of terms: "))

# Call the fibonacci function
fibonacci(n)
def fibonacci(n):
    a = 0
    b = 1
    for i in range(n):
        print(a, end=" ")
        a, b = b, a + b
    print()

# Ask the user for the number of terms
n = int(input("Enter the number of terms: "))

# Call the fibonacci function
fibonacci(n)def fibonacci(n):
    a = 0
    b = 1
    for i in range(n):
        print(a, end=" ")
        a, b = b, a + b
    print()

# Ask the user for the number of terms
n = int(input("Enter the number of terms: "))

# Call the fibonacci function
fibonacci(n)`;


// The main component
function App()
{
  // The state variables
  const [peeks, setPeeks] = useState(0);
  const [copiedCode, setCopiedCode] = useState("");
  const [showOriginal, setShowOriginal] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [peekActive, setPeekActive] = useState(false);
  // Add these lines
  const copiedCodeRef = useRef(null);
  const originalCodeRef = useRef(null);

  const handlePeek = () =>
  {
    setPeekActive(true);
    setTimeout(() =>
    {
      setPeekActive(false);
    }, 5000);
    peekCode(setPeeks, setShowOriginal);
  };

  const handleScroll = (e) =>
  {
    const { scrollTop } = e.currentTarget;
    if (copiedCodeRef.current && originalCodeRef.current)
    {
      copiedCodeRef.current.scrollTop = scrollTop;
      originalCodeRef.current.scrollTop = scrollTop;
    }
  };
  
  useEffect(() =>
  {
    const interval = setInterval(() =>
    {
      setSeconds(seconds => seconds + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  

  const handleCheck = () =>
  {
    const result = checkCode(originalCode, copiedCode, peeks, seconds);
    if (result)
    {
      setDisabled(true);
    }
  };

  const handleChange = (e) =>
  {
    setCopiedCode(e.target.value);
  };

  // The JSX elements
  return (
    <Box display="flex" alignItems="center" style={{ height: '100vh' }}>
      <SplitPane split="vertical" minSize={100} defaultSize="50vw">
        <Box className="pane" sx={{ p: 2 }}>
          <Typography variant="h4" gutterBottom style={{ marginLeft: '10px' }}>
            Code Replication Task
          </Typography>
          <textarea
            id="copied-code"
            rows={23}
            placeholder="Type the code here"
            value={copiedCode}
            onChange={handleChange}
            disabled={showOriginal}
            ref={copiedCodeRef} // Add this line
            onScroll={handleScroll} // Add this line
          />

        <Button variant="contained" onClick={handleCheck} disabled={disabled} style={{ marginTop: '20px', marginLeft:'10px'}}>
          Check
        </Button>
            </Box>
         
        <Box className="pane" sx={{ p: 2 }}>
          <Typography variant="h4" gutterBottom style={{ marginLeft: '10px' }}>
            Original Code
          </Typography>
          {showOriginal && (
            <textarea
              id="original-code"
              rows={23}
              value={originalCode}
              
              readOnly
              ref={originalCodeRef} // Add this line
              onScroll={handleScroll} // Add this line
            />
          )}

          
          
          

          <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
            <Button variant="contained" onClick={handlePeek} disabled={peekActive} style={{ marginLeft: '10px' }}>
              Peek
            </Button>
            <Typography variant="h5" gutterBottom style={{ marginLeft: '10px', marginTop:'8px'}}>
              Number of peeks: <span id="peek-count">{peeks}</span>, Total time: {seconds} seconds
            </Typography>
          </div>

            </Box>
            

      </SplitPane>
      </Box>
      
  );

}

export default App;
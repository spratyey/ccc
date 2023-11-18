import React, { useState, useEffect, useRef } from 'react';
import SplitPane from 'react-split-pane';
import { Button, Typography, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import StringSimilarity from 'string-similarity';





import './App.css';



// A function to check if the copied code is within 90% Levenshtein distance of the original code
function checkCode(originalCode, copiedCode, peeks, seconds, matchPercentages, setMatchPercentages)
{
  originalCode = originalCode.replace(/\s/g, '').toLowerCase();
  copiedCode = copiedCode.replace(/\s/g, '').toLowerCase();

  // Use string-similarity to get the similarity ratio
  var ratio = StringSimilarity.compareTwoStrings(originalCode, copiedCode);
  ratio = Math.round(ratio * 100);
  setMatchPercentages([...matchPercentages, ratio]);
 
  if (ratio >= 90)
  {

    return true;
  }
  else
  {
    //alert("Your code is not close enough. Please try again.");
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

let originalCode = "hi";


let donetime = 0;
// The main component
function App()
{
  // The state variables
  const [peeks, setPeeks] = useState(0);
  const [copiedCode, setCopiedCode] = useState("");
  const [showOriginal, setShowOriginal] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [peekActive, setPeekActive] = useState(false);
  const [matchPercentages, setMatchPercentages] = useState([]);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const handleNavigateToOne = () =>
  {
    window.location.href = '/one';
  };

  const handleSuccessDialogClose = () =>
  {
    setSuccessDialogOpen(false);
    window.location.reload();
  };
  const handleCopyToClipboard = () =>
  {
    const percentagesString = matchPercentages.join(', ');
    navigator.clipboard.writeText(percentagesString);
  };

  // Add these lines
  const copiedCodeRef = useRef(null);
  const originalCodeRef = useRef(null);

  const handlePeek = () =>
  {
    const result = checkCode(originalCode, copiedCode, peeks, seconds, matchPercentages, setMatchPercentages);
    if (result)
    {
      donetime=seconds;
      setSuccessDialogOpen(true);
    }
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

  useEffect(() =>
  {
    const fetchData = async () =>
    {
      try
      {
        const response = await fetch(window.location.pathname === '/one' ? '/goodcode.txt' : '/badcode.txt');
        const data = await response.text();
        originalCode = data;
      } catch (error)
      {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); 
  
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
              Num Peeks: <span id="peek-count">{peeks}</span>, Time: {seconds} seconds, Replication: { matchPercentages[matchPercentages.length - 1]}%
            </Typography>
          </div>

            </Box>
            

      </SplitPane>
      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onClose={handleSuccessDialogClose}>
        <DialogTitle>Success!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have successfully copied the code with {peeks} peeks and {donetime} seconds! <br />
            Match percentages: {matchPercentages.join(', ')}%
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCopyToClipboard} color="primary">
            Copy to Clipboard
          </Button>
          {window.location.pathname !== '/one' && (
          
            <Button onClick={handleNavigateToOne} color="primary">
              Next Level
            </Button>
          )}
          <Button onClick={handleSuccessDialogClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
      
  );

}

export default App;
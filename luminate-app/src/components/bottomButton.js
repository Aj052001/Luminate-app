import React from 'react';

import { useNavigate } from 'react-router-dom';
import { useAuth } from './UserContext';

const BottomButton = () => {
  const { authData } = useAuth();
   
  const { isAuthenticated} = authData; 
    const navigate = useNavigate();
    function goToMentalStateSelector() {
        // Navigate to the MentalStateSelector page
        if(isAuthenticated)
        {
          navigate('/intension');
        }
      }
    function goToResource() {
        // Navigate to the MentalStateSelector page
        if(isAuthenticated)
          {
            navigate('/resource');
          }
        
      }
    function goToExperience() {
        // Navigate to the MentalStateSelector page
        if(isAuthenticated)
          {
            navigate('/postExperience');
          }
        
      }
      return (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-purple-700 py-4 flex flex-wrap justify-between px-4 sm:px-6 gap-2">
          <button
            onClick={goToMentalStateSelector}
            className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all"
          >
            Intention
          </button>
          <button
            onClick={goToResource}
            className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all"
          >
            Mid Trip Experience
          </button>
          <button
            onClick={goToExperience}
            className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all"
          >
            Post Experience
          </button>
        </div>
      );
      

}



export default BottomButton


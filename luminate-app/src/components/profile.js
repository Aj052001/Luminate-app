import React, { useEffect, useState } from "react";
import { User, Loader2, LogOut } from "lucide-react";
import NavigationBar from "./navigation";
import { useAuth } from "./UserContext";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { authData, logout } = useAuth();
  const { email, token } = authData;
  const [profileData, setProfileData] = useState(null);
  const [journalData, setJournalData] = useState(null);
  const [journeyData, setJourneyData] = useState(null);
  const [muscleData, setMuscleData] = useState(null);
  const [postData, setPostData] = useState(null);
  const [audioData, setAudioData] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfileData();
  }, []);


  // console.log(profileData.journeysAll.levels)
  // console.log( typeof profileData.journeysAll)
  useEffect(() => {
    if (selectedDate) {
      const filteredData1 = profileData.journalAllData.filter(
        (item) => item.experienceDate === selectedDate
      );
      setJournalData(filteredData1);

      // const filteredData2 = profileData.journeysAll.filter(item => item.experienceDate === selectedDate);
      // setJourneyData(filteredData2);


      // const filteredData2 = profileData.journeysAll.filter((item) => {
      //   // Extract the date part from createdAt
      //   const createdAtDate = new Date(item.createdAt)
      //     .toISOString()
      //     .split("T")[0];
      //   // Compare it with the selected date
      //   return createdAtDate === selectedDate;
      // });
      // setMuscleData(filteredData2);


      const filteredData3 = profileData.muscleSelectionsAll.filter((item) => {
        // Extract the date part from createdAt
        const createdAtDate = new Date(item.createdAt)
          .toISOString()
          .split("T")[0];
        // Compare it with the selected date
        return createdAtDate === selectedDate;
      });
      setMuscleData(filteredData3);

      const filteredData4 = profileData.postExperiencesAll.filter((item) => {
        // Extract the date part from createdAt
        const createdAtDate = new Date(item.createdAt)
          .toISOString()
          .split("T")[0];
        // Compare it with the selected date
        return createdAtDate === selectedDate;
      });

      setPostData(filteredData4);
      const filteredData5 = profileData.audiosAll.filter((item) => {
        // Extract the date part from createdAt
        const createdAtDate = new Date(item.createdAt)
          .toISOString()
          .split("T")[0];
        // Compare it with the selected date
        return createdAtDate === selectedDate;
      });

      setAudioData(filteredData5);
    }
  }, [selectedDate]);




  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setProfileData(data.data);
        const latestDate = data.data.dates[data.data.dates.length - 1]; // Get the last date, assuming it's the latest
        setSelectedDate(latestDate);
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Error fetching user data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const DateDropdown = () => (
    <select
      className="mb-4 p-2 bg-gray-800 text-white rounded"
      style={{ position: "relative", top: "-61px" }}
      value={selectedDate}
      onChange={handleDateChange}
    >
      {[...profileData?.dates].reverse().map((date, index) => (
        <option key={index} value={date}>
          {date}
        </option>
      ))}
    </select>
  );

  const renderUserInfoCard = () => {
    if (!profileData?.user) return null;

    return (
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 flex flex-col items-center mb-8">
        <div className="flex items-center space-x-4 w-full border-b border-gray-700 pb-4 mb-4">
          <User className="w-10 h-10 text-purple-500" />
          <h2 className="text-2xl font-bold text-purple-400">User Profile</h2>
        </div>
        <img
          src={"profile.jpg"}
          alt={profileData.user.name}
          className="w-32 h-32 rounded-full border-4 border-purple-500 object-cover mb-4"
        />
        <h3 className="text-xl font-bold text-white">
          {profileData.user.name}
        </h3>
        <p className="text-gray-400">{profileData.user.email}</p>
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <LogOut className="mr-2" /> Logout
        </button>
      </div>
    );
  };

  const renderSection = (title, content) => (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8">
      <h2 className="text-2xl font-bold text-purple-400 mb-4">{title}</h2>
      {content.length > 0 ? (
        content.map((item, index) => (
          <div key={index} className="mb-4">
            {item}
          </div>
        ))
      ) : (
        <p className="text-gray-400">No data available</p>
      )}
    </div>
  );

  const renderOnboardingQuestions = () =>
    profileData.onboardingQuestion
      ? renderSection(
          "Onboarding Questions",
          profileData.onboardingQuestion.responses.map((response, idx) => (
            <div key={idx} className="text-gray-300 space-y-1">
              <p>
                <strong>Q:</strong> {response.question}
              </p>
              <p>
                <strong>A:</strong> {response.answer}
              </p>
            </div>
          ))
        )
      : null;

  const renderJourneys = () =>
    profileData.journeys
      ? renderSection(
          "Journeys",
          profileData.journeys.levels.map((level, idx) => (
            <div key={idx} className="text-gray-300 space-y-2">
              <h3 className="text-purple-300 font-semibold">{level.title}</h3>
              {level.questionAnswers.map((qa, i) => (
                <p key={i} className="space-y-1">
                  <strong>Q:</strong> {qa.question} <br />
                  <strong>A:</strong> {qa.answer}
                </p>
              ))}
            </div>
          ))
        )
      : null;

  

  const renderMuscleSelections = () =>
    muscleData
      ? renderSection("Muscle Selections", [
          muscleData.map((item) => (
            <p className="text-gray-300 space-y-1" key={item._id}>
              {item.selectedMuscles?.join(", ") || "None"}
            </p>
          )),
        ])
      : renderSection("Muscle Selections", [
          <div className="text-gray-300 space-y-1" key="muscles">
            <p>
              <strong>Selected Muscles:</strong>{" "}
              {profileData.muscleSelections?.selectedMuscles?.join(", ") ||
                "None"}
            </p>
          </div>,
        ]);

  const renderPostExperiences = () =>
    postData
      ? renderSection("Post Experiences", [
          postData.map((item) => (
            <p className="text-gray-300 space-y-1" key={item._id}>
              {item.postExperience}
            </p>
          )),
        ])
      : renderSection("Post Experiences", [
          <p className="text-gray-300 space-y-1" key="postExp">
            {profileData.postExperiences.postExperience}
          </p>,
        ]);

  const renderAudios = () =>
    audioData
      ? renderSection(
          "Audios",
          audioData.map((item) => (
            <p className="text-gray-300 space-y-1" key={item._id}>
              {item.audio}
            </p>
          ))
        )
      : renderSection(
          "Audios",
          audioData.map((item) => (
            <p className="text-gray-300 space-y-1" key={item._id}>
              {profileData.audios.audio}
            </p>
          ))
        );

  const renderJournals = () => {
    // If journalData is not null, show specific journal data for the selected date
    if (journalData) {
      return (
        <div className="flex justify-between items-center bg-gray-800 rounded-lg shadow-xl p-6 mb-8">
          <div className="flex-grow">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">
              Journals
            </h2>
            <div className="text-gray-300 space-y-1">
              {journalData.map((journal) => (
                <React.Fragment key={journal._id}>
                  <p>
                    <strong>Medicine:</strong> {journal.medicine}
                  </p>
                  <p>
                    <strong>Intention:</strong> {journal.intention}
                  </p>
                  <p>
                    <strong>Current State:</strong> {journal.currentState}
                  </p>
                  <p>
                    <strong>Post Experience:</strong> {journal.postExperience}
                  </p>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div>
            <DateDropdown />
          </div>
        </div>
      );
    } else {
      // If journalData is null, show default data from profileData.journals
      // This block will execute when the component is initially rendered
      if (!profileData?.journals)
        return <p>No default journal entries available.</p>;

      return (
        <div className="flex justify-between items-center bg-gray-800 rounded-lg shadow-xl p-6 mb-8">
          <div className="flex-grow">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">
              Journals
            </h2>
            <div className="text-gray-300 space-y-1">
              <p>
                <strong>Medicine:</strong> {profileData.journals.medicine}
              </p>
              <p>
                <strong>Intention:</strong> {profileData.journals.intention}
              </p>
              <p>
                <strong>Current State:</strong>{" "}
                {profileData.journals.currentState}
              </p>
              <p>
                <strong>Post Experience:</strong>{" "}
                {profileData.journals.postExperience}
              </p>
            </div>
          </div>
          <div>
            <DateDropdown />
          </div>
        </div>
      );
    }
  };

  const ProfileLoader = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black via-purple-950 to-black">
      <Loader2 className="animate-spin text-white mb-4" size={64} />
      <h2 className="text-xl font-semibold text-white">
        Loading Profile Data...
      </h2>
      <p className="text-sm text-blue-100 mt-2">
        Please wait while we retrieve your information.
      </p>
    </div>
  );

  if (loading) {
    return <ProfileLoader />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-center text-red-500">
        <p className="mb-4">{error}</p>
        <button
          onClick={fetchProfileData}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <NavigationBar />
      <div className="max-w-6xl mx-auto">
        {renderUserInfoCard()}
        {renderOnboardingQuestions()}
        {renderJournals()}
        {renderMuscleSelections()}
        {renderJourneys()}
        {renderPostExperiences()}
        {renderAudios()}
      </div>
    </div>
  );
};

export default UserProfile;

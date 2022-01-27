
// file location of JSON file

const fileUrl = "assets/data/data.json";

function initializeOptChangeStates() {
  const trackingOptions = document.querySelectorAll(".dashboard__options")

  trackingOptions.forEach(optClicked => {
  
    optClicked.addEventListener("click", () => {
  
      trackingOptions.forEach(opt => {
        opt.classList.remove("dashboard__options--active");
      })

      optClicked.classList.add("dashboard__options--active");

      getUserData(fileUrl);

    }) // end of optClicked add event listener
  }) // end of tracking options for each
} // end of initialize function


// this function sets the show weekly option as the default

function initializeActiveOption() {
  const dashboard = document.querySelector(".dashboard");
  const optionList = dashboard.querySelector(".dashboard__tracking-options");
  const weekly = optionList.querySelector(".dashboard__options[data-opt='weekly']");

  weekly.click();
}

// reads the URL then converts it as a JSON file
// then run the updateDashbord function to change the dashboard contents

const getUserData = async (url) => {
  fetch(url)
  .then((response) => {
     return response.json();
  })
  .then((data) => {
    updateDashboard(data);
  })
  .catch(() => {
    console.error("Invalid file name or file directory.");
  })
}

// since the hours within the JSON file is three levels deep
// I decided to create a separate function solely to retrieve them


const getHours = (cat, opt) => {
  return {
    "timeframes" : opt,
    "current" : cat["timeframes"][opt]["current"],
    "previous" : cat["timeframes"][opt]["previous"]
  }
}

// change the hours on the dashboard based on the active option

const updateHours = (card, hours) => {
  const currentTime = card.querySelector(".dashboard__stats-time");
  const prevTime = card.querySelector(".dashboard__stats-prev-time");

  let prevTimeString = "";

  switch(hours["timeframes"]) {
    case "daily" :
      prevTimeString = "Yesterday";
      break;
    case "weekly" :
      prevTimeString = "Last Week";
      break;
    case "monthly" :
      prevTimeString = "Last Month";
      break;
    default:
      console.error("Received timeframe does not exist.");
      break;
  }

  currentTime.innerHTML = `${hours["current"]}hrs`;
  prevTime.innerHTML = `${prevTimeString} - ${hours["previous"]}hrs`;
}

// the main function that runs the other function related to updating the dashboard

const updateDashboard = async (userData) => {
  // take the option that is active
  // take all the stats card
  // update the stats card content based the active option
  const activeOption = document.querySelector(".dashboard__options--active").dataset.opt;
  const statsCardArr = document.querySelectorAll(".dashboard__stats-card");

  /*

  Below, the code only managed to work as intended because of the structure of JSON.
  I was originally planning to do a nested forEach to map the hours based on the categories.
  However, I decided not to since it runs on o(n^2). This whole dashboard will break if the
  order of data was changed. I will update this after learning more data structures.

  */

  userData.forEach((category, index) => {
    let hours = getHours(category, activeOption);

    updateHours(statsCardArr[index], hours);
  })
}

// run all function after all HTML and CSS content has loaded

document.addEventListener("DOMContentLoaded", () => {
  initializeOptChangeStates();
  initializeActiveOption()
});
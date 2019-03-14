var cards = [];
// var isDataReceived = false;

function getSongData(){
  
    fetch('/songList.json')
      .then(function(response) {
      return response.json();
    })
      .then(function(myJson) {
    //   isDataReceived = true;
      createCardsFromData(myJson);
    });
}

function createCardsFromData(data)
{
  for(var i =0; i < data.length; i++)
  {
    
  createCard(data[i]);
  }
}

function createCard(card_data)
{
  var cardDiv = createHtmlElement("div", "");

  var cardArtist = createHtmlElement("p", `${card_data.artist} `);
  var cardSong = createHtmlElement("p", `- ${card_data.song}`);
  
  
  cardDiv.appendChild(cardArtist);
  cardDiv.appendChild(cardSong);

  var cardClass = document.createAttribute("class");
  cardClass.value = "card";
  cardDiv.setAttributeNode(cardClass);
  
  pushDataToArray(card_data.artist, card_data.song, cardDiv);
  addHtmlToRoot(cardDiv);
}

function pushDataToArray(cardArtist, cardSong, cardNode)
{
  cards.push({
    artist: cardArtist,
    song: cardSong,
    node: cardNode
  })
}


function addHtmlToRoot(element)
{
  document.getElementById("root").appendChild(element);
}

function createHtmlElement(element, textValue)
{
  var elementNode = document.createElement(element);
  elementNode.textContent = textValue;
  return elementNode;
}

function searchAll()
{
    document.getElementById("artist").value = "";
    document.getElementById("songTitle").value = "";
    search("");
}

function searchArtist()
{
    document.getElementById("all").value = "";
    document.getElementById("songTitle").value = "";
    search("artist");
}

function searchSong()
{
    document.getElementById("all").value = "";
    document.getElementById("artist").value = "";
    search("song");
}

function search(searchType){

    var searchBar = "";

    if(searchType === "artist")
    {
        searchBar = document.getElementById("artist").value.toUpperCase();
    }
    else if(searchType === "song")
    {
        searchBar = document.getElementById("songTitle").value.toUpperCase();
    }
    else
    {
        searchBar = document.getElementById("all").value.toUpperCase();
    }

    var results = [];
  
    if(searchBar !== "")
    {
      var myNode = document.getElementById("root");
      while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
      }


      for(var i = 0; i < cards.length; i++)
      {
        var upperName = ``;

        if(searchType === "artist")
        {
            upperName = `${cards[i].artist.toUpperCase()}`;
        }
        else if(searchType === "song")
        {
            upperName = `${cards[i].song.toUpperCase()}`;
        }
        else
        {
            upperName = `${cards[i].artist.toUpperCase()} ${cards[i].song.toUpperCase()}`;
        }
        

        if(upperName.includes(searchBar))
        {
          results.push(cards[i]);
        }
      }

      for(var j = 0; j < results.length; j++)
      {
        addHtmlToRoot(results[j].node);
      }

    }
    else{
      for(var k = 0; k < cards.length; k++)
      {
        addHtmlToRoot(cards[k].node);
      }
    }
}

window.onscroll = function() {scrollButton()};

var topButton = document.getElementById("topButton");

var sticky = topButton.offsetTop;

// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function scrollButton() {
  if (window.pageYOffset > sticky) {
    topButton.classList.add("backUpButton");
    topButton.classList.remove("backUpButtonHide");
  } else {
    topButton.classList.add("backUpButtonHide");
    topButton.classList.remove("backUpButton");
  }
}
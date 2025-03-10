console.log("Spotify is Running");

let currentSong = new Audio();
let songs;
let currfolder;


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
    let response = await a.text();
    //console.log(response)
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

 
//show all shows in playlist
    let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songUl.innerHTML=""
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li>
                        <img class="invert" src="music.svg" alt="">
                        <div class="info">
                            <div>${String(song).replaceAll("%20", " ")}</div>
                            <div>Dhanush</div>
                        </div>
                        <div class="playnow">
                        <span>Play Now</span>
                        <img class="invert" src="playnow.svg" alt="">
                    </div>
        </li>`;
    }
    //attach event lister to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
        });
    });
   return songs
}

const playMusic = (track, pause = false) => {
    // var audio = new Audio(`/Songs/_songs${track}`);
    currentSong.src = `/${currfolder}/` + track
    currentSong.load();
    // currentSong.play();
    if (!pause) {
        currentSong.play();
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
    
}
async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/Songs/`);
    let response = await a.text();
    //console.log(response)
    let div = document.createElement("div");
    div.innerHTML = response;
  let anchors=  div.getElementsByTagName("a")
  let cardContainer=document.querySelector(".cardContainer")
 let array=Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
    
        
    
    if(e.href.includes("\Songs")){
        let folder=e.href.split("/").slice(-2)[0]
        //get the metadata of folder
        let a = await fetch(`http://127.0.0.1:3000/Songs/${folder}/info.json`);
        let response = await a.json();
        console.log(response)
        cardContainer.innerHTML=cardContainer.innerHTML+` <div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22"
                                color="#000000" fill="none">
                                <path
                                    d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                    stroke="currentColor" fill="black" stroke-width="1.5" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jpg"
                            alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
    
    }
  }

      //load playlist whenever card is clicked

      Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            // console.log(item,item.currentTarget.dataset)
            songs = await getSongs(`Songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0])

        })
    })
    
}

async function main() {

    // Get the list of songs 
    await getSongs("Songs/recent");
    playMusic(songs[0], true)
    console.log(songs);

    //Display all albums on the page

    displayAlbums()

    //attach an event listner to play , next previous

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        } else {
            currentSong.pause()
            play.src = "play.svg"

        }
    })

    //timeupdate event

    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"

    })

    //add event lister to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    //eventlistner for hamburgur
    document.querySelector(".hamburgur").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    //eventlister to close hamburgur

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-130%"
    })

    //adding eventlistner to previous and next
    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        // console.log(songs)
        // console.log(index)
        let index = songs.indexOf(currentSong.src.split("/Songs/").pop())
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/Songs/").pop())
        console.log(index)
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    //volume range

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume:", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100;
    })

    //eventlsitner to mute the track


    document.querySelector(".volume>img").addEventListener("click",e=>{
        console.log(e.target)
        if(e.target.src.includes("volume.svg")){
            e.target.src=e.target.src.replace("volume.svg","mute.svg")
            currentSong.volume=0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0;
        }else{
           e.target.src= e.target.src.replace("mute.svg","volume.svg")
            currentSong.volume=.10
            document.querySelector(".range").getElementsByTagName("input")[0].value=50;
        }
    })

 

}


main()

const base_url = "https://api.football-data.org/v2/";
const token = '5bc97521e19d46ea8cfddc40cfbdfde7';
const id_inggris = 2021;

const endpoint_standings = `${base_url}competitions/${id_inggris}/standings`;
const endpoint_detailTeam = `${base_url}teams/`;
const endpoint_matches = `${base_url}/competitions/${id_inggris}/matches?status=SCHEDULED`;

const fetchApi = url => {

  return fetch(url, {
      method: "get",
      mode: "cors",
      headers: {
        'X-Auth-Token': token
      }
    })
    .then(status)
    .then(json)
    .catch(error);
}

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}
// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}
// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

function getStandings() {
  showLoader();
  if ('caches' in window) {
    caches.match(endpoint_standings).then(response => {
      if (response) {
        response.json().then(data => {
          showStandings(data);
        });
      }
    });
  }

  fetchApi(endpoint_standings).then(data => {
    showStandings(data);
  })
}

function getMatches() {
  if ('caches' in window) {
    caches.match(endpoint_matches).then(response => {
      if (response) {
        response.json().then(data => {
          showtMatchesTeam(data);
        });
      }
    });
  }

  fetchApi(endpoint_matches).then(data => {
    showtMatchesTeam(data);
  })
}

function getTeam(team) {
  showLoader();
  if ('caches' in window) {
    caches.match(team).then(response => {
      if (response) {
        response.json().then(data => {
          showTeam(data);
        });
      }
    });
  }

  fetchApi(team).then(data => {
    showTeam(data);
    buttonAction(data);
  })
}

function showStandings(data) {
  hideLoader();
  let standingsHTML = '';
  standingsHTML += `
  <thead class="grey lighten-4">
  <tr>
      <th>Peringkat</th>
      <th>Team</th>
      <th>PG</th>
      <th>W</th>
      <th>D</th>
      <th>L</th>
      <th>Points</th>
  </tr>
 </thead>
  `;
  data.standings[0].table.forEach(dt => {
    standingsHTML += `  
   <tbody>
<tr>
<td>${dt.position}</td>
<td><a href="./team.html?id=${dt.team.id}"><img class="responsive-img" width="45px" alt="gambarclub" src="${dt.team.crestUrl}"  /></td>
<td>${dt.playedGames}</td>
<td>${dt.won}</td>
<td>${dt.draw}</td>
<td>${dt.lost}</td>
<td>${dt.points}
<td>
</tr>
</tbody>  
    `;
  })
  document.getElementById("standings").innerHTML = standingsHTML;
}

function showtMatchesTeam(data) {
  hideLoader();
  let matchesHTML = '';
  data.matches.forEach(function (match) {

    matchesHTML += `
    
        <thead>
          <tr>
              <th class="grey lighten-4">Date And Kick Off</th>
              <th class="grey lighten-4">Home</th>
              <th class="grey lighten-4">Away</th>
          </tr>
      </thead>
      <tbody>
          <td>${new Date(match.utcDate)}</td>
          <td>${match.homeTeam.name}</td>
          <td>${match.awayTeam.name}</td>
      </tbody

    `
  })
  document.getElementById("matchesTeam").innerHTML = matchesHTML;
}

function showTeam(data) {
  hideLoader();
  seeDetailHTML = '';
  seeDetailHTMLInformation = '';
  seeDetailHTMLImage = '';

  seeDetailHTMLImage += `
  
  <div class="center-align" style="margin-top: 10px;">
        <img alt="gambarclub" src=${data.crestUrl.replace(/^http:\/\//i, 'https://')} onError="this.onerror=null;this.src='/images/default.png';" width="150" height="150" class="responsive-img center"><br>
        <h5>${data.name}</h5>
       <center>
          <button id="add" class="btn waves-effect waves-light center-align" type="submit" name="action"><i class="material-icons">add</i> 
          </button>
          <button id="delete" class="btn waves-effect waves-light center-align" type="submit" name="action"><i class="material-icons">delete</i></button>
      </center>           
  </div>
  
  `;

  document.getElementById("teamInfoImage").innerHTML = seeDetailHTMLImage;

  seeDetailHTMLInformation += `

    <div class="card-content">
        <tr>
            <td style="font-weight: bold;">Name</td>
            <td>${data.name}</td>
        </tr>
        <tr>
            <td style="font-weight: bold;">Short Name</td>
            <td>${data.shortName}</td>
        </tr>
        <tr>
            <td style="font-weight: bold;">Founded</td>
            <td>${data.founded}</td>
        </tr>
        <tr>
            <td style="font-weight: bold;">Three Letter Abbreviation</td>
            <td>${data.tla}</td>
        </tr>
        <tr>
            <td style="font-weight: bold;">Address</td>
            <td>${data.address}</td>
        </tr>
        <tr>
            <td style="font-weight: bold;">Phone</td>
            <td>${data.phone}</td>
        </tr>
        <tr>
            <td style="font-weight: bold;">Website</td>
            <td><a href="${data.website}" target="_blank">${data.website}</a></td>
        </tr>
        <tr>
            <td style="font-weight: bold;">Email</td>
            <td><a href="mailto:${data.email}">${data.email}</a></td>
        </tr>
        <tr>
            <td style="font-weight: bold;">Club Colors</td>
            <td>${data.clubColors}</td>
        </tr>
        <tr>
            <td style="font-weight: bold;">Venue</td>
            <td>${data.venue}</td>
        </tr>
    </div>
  `;

  document.getElementById("teamInfoDetail").innerHTML = seeDetailHTMLInformation;

  seeDetailHTML += `
  
  <tr>
      <th>Nama Pemain</th>
      <th>Posisi</th>
      <th>Negara</th>
  </tr>
  
  `;

  data.squad.forEach(dt => {
    seeDetailHTML += `

   <tr>
       <td>${dt.name}</td>
       <td>${dt.position}</td>
       <td>${dt.nationality}</td>
   </tr>
</tbody>  
    `
  })
  document.getElementById("teamInfo").innerHTML = seeDetailHTML;
}

function getFavoriteTeam() {
  hideLoader();
  var dbData = getFavData();
  dbData.then(data => {
    var timBodyHtml = '';
    if (data.length > 0) {
      data.forEach(team => {
        timBodyHtml += `
        <tbody>
        <tr>
        <td><a href="./team.html?id=${team.id}"><b>${team.name}</b></a></td>
        <td><img class="responsive-img" width="45px" alt="gambarclub" alt="gambarclub" src="${team.crestUrl}"/></td>
        </tr>
        </tbody>  `;
      });
    } else {
      timBodyHtml = '<h6>Belum ada tim favorit ditambahkan</h6>';
    }
    document.getElementById("favTeam").innerHTML = timBodyHtml;
  });
}

function buttonAction(data) {
  let btnAdd = document.getElementById("add");
  let btnDelete = document.getElementById("delete");

  checkData(data.id).then(() => {
    btnAdd.style.display = "none";
    btnDelete.style.display = "block";
  }).catch(() => {
    btnAdd.style.display = "block";
    btnDelete.style.display = "none";
  });

  btnAdd.onclick = () => {
    addFavorite(data);
    btnAdd.style.display = "none";
    btnDelete.style.display = "block"
  }

  btnDelete.onclick = () => {
    deleteFavorite(data);
    btnAdd.style.display = "block";
    btnDelete.style.display = "none";
  }
}

function showLoader() {
  var loader = `<div class="preloader-wrapper big active">
    <div class="spinner-layer spinner-gray-only" >
      <div class="circle-clipper left">
        <div class="circle"></div>
      </div> <div class="gap-patch">
        <div class="circle"></div>
      </div> <div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>
  </div>`
  document.getElementById("loader").innerHTML = loader;
}

function hideLoader() {
  document.getElementById("loader").innerHTML = '';
}
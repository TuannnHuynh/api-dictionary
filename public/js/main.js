const api = "https://api.dictionaryapi.dev/api/v2/entries/en";

function renderAlert(info) {
  let str = "";
  str += `
    <span><i class="fa-solid fa-circle-info"></i>${info}</span>
    `;
  $(".alert").html(str);
}

function toggleAlert() {
  $(".alert").removeClass("hide");
  $(".alert").addClass("show");
  setTimeout(() => {
    $(".alert").removeClass("show");
    $(".alert").addClass("hide");
  }, 2000);
}

function render(word, phonetic) {
  let str = "";
  str += `
        <div class="key-word">
            <span class="word">${word}</span>
            <span class="phonetic">${phonetic || ""}</span>
        </div>
        <div class="language">
            <span><i class="fa-solid fa-language"></i></span>
        </div>
    `;
  $(".dict-word").html(str);
}

function renderMeanings(meanings) {
  let str = "";
  for (let i = 0; i < meanings.length; i++) {
    str += `
    <div class="meaning">
        <h3>${meanings[i]["partOfSpeech"]}</h3>
        <p class="definition"><span>Definition:</span> ${
          meanings[i]["definitions"][0]["definition"] || ""
        }</p>
        <p class="example"><span>Example:</span> ${
          meanings[i]["definitions"][0]["example"] || ""
        }</p>
    </div>
    `;
  }
  $(".dict-meanings").html(str);
}

$(".dict-form").submit(function (e) {
  e.preventDefault();
  const word = $("input").val();
  if (!word) {
    renderAlert("Please enter the search keyword !");
    toggleAlert();
    $("input").focus();
    return;
  }
  $.get(`${api}/${word.toLowerCase()}`)
    .done((data) => {
      $(".dict-word").css("border-bottom", "2px solid #999");
      const result = data[0];
      const { word, phonetic, meanings } = result;
      render(word, phonetic);
      renderMeanings(meanings);
      $("input").val("");
    })
    .fail(function (jqXHR) {
      if (jqXHR.status === 404) {
        renderAlert("Word not found !");
        toggleAlert();
        $("input").val("");
      } else {
        renderAlert(
          "An error occurred while processing your request. Please try again later."
        );
        toggleAlert();
        $("input").val("");
      }
    });
});

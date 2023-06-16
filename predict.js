document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM content loaded");

  let upload = document.querySelector("#inputGroupFile01");
  let playerRef = document.querySelector("#player");
  let predictBtn = document.querySelector("#predict");
  let serverDomain = document.querySelector("#serverDomainInput");

  let placeholder = document.querySelectorAll(".placeholder");
  let loading = document.querySelector(".spinner-border");

  let fakeVal = document.querySelector(".value-fake");
  let realVal = document.querySelector(".value-real");

  // Toast
  const toastLiveExample = document.getElementById("liveToast");
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);

  function displayLoading() {
    for (let e of placeholder) {
      e.style.display = "inline-block";
    }
    loading.style.display = "inline-block";
    fakeVal.innerHTML = "";
    realVal.innerHTML = "";
  }

  function hiddenLoading() {
    for (let e of placeholder) {
      e.style.display = "none";
    }
    loading.style.display = "none";
  }

  hiddenLoading();

  //   serverDomain.addEventListener("change", (e) => {
  //     console.log(serverDomain);
  //   });

  upload.addEventListener("change", (e) => {
    let file = upload.files[0];
    playerRef.src = window.URL.createObjectURL(file);
    window.isRecord = false;
    window.recordFile = null;
  });

  async function makingPrediction(file) {
    try {
      console.log("UPLOAD FILE", file);
      const formData = new FormData();
      formData.append("file", file);

      let res = await fetch(
        `${
          serverDomain.value || "https://e609-202-191-58-174.ngrok-free.app"
        }/predict`,
        {
          method: "POST",
          // headers: {
          //     "Content-Type": "multipart/form-data"
          // },
          body: formData,
        }
      );
      res = await res.json();

      if (res?.code === 200) {
        fakeVal.innerHTML = res?.data?.Fake;
        realVal.innerHTML = res?.data?.Real;
        hiddenLoading();
      } else {
        throw new Error(
          res?.message || res?.data || "Smt wrong 've been occured!"
        );
      }
    } catch (error) {
      console.log("ERROR", error);
      let toastBody = document.querySelector(".toast-body");
      toastBody.innerHTML = error?.message || error?.data;
      toastBootstrap.show();
      hiddenLoading();
    }
  }

  predictBtn.addEventListener("click", async () => {
    if (window.isRecord) {
      displayLoading();
      // console.log(window.recordFile, "RECORD BLOB");
      // let blobRes = await fetch(playerRef.src, {});
      // blobRes = await blobRes.blob();
      let blobRes = window.recordFile;
      console.log(blobRes)
      let file = new File([blobRes], "filename.wav", { type: blobRes.type });
      makingPrediction(file);
    } else if (upload.files?.[0]) {
      displayLoading();
      const file = upload.files?.[0];
      makingPrediction(file);
    } else {
      alert("Please upload audio file or record");
    }
  });
});

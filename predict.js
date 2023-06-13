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

  function displayLoading() {
    for (let e of placeholder) {
      e.style.display = "inline-block";
    }
    loading.style.display = "inline-block";
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
  });

  predictBtn.addEventListener("click", async () => {
    if (upload.files?.[0]) {
      displayLoading();
      const formData = new FormData();
      const file = upload.files?.[0];
      formData.append("file", file);

      try {
        console.log(serverDomain.value);
        let res = await fetch(`${serverDomain.value}/predict`, {
          method: "POST",
          // headers: {
          //     "Content-Type": "multipart/form-data"
          // },
          body: formData,
        });
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
      }
    } else {
      alert("Please upload audio file or record");
    }
  });
});

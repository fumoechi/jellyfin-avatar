const prefix = "jf-avatars";

const baseUrl =
  "https://raw.githubusercontent.com/kalibrado/js-avatars-images/refs/heads/main";

const baseUrlImages = `${baseUrl}/images_metadata.json`;
const baseUrlFolders = `${baseUrl}/folders_names.json`;
const fallbackUrl = `https://raw.githubusercontent.com/kalibrado/jf-avatars/refs/heads/main/src/lang/`;

const getValue = (property, element = document.body) => {
  const computedStyle = window.getComputedStyle(element);
  const value = computedStyle
    .getPropertyValue(property)
    .replace(/['"]/g, "")
    .trim();
  return value.trim();
};

const props = {
  getTitle: () => window.i18n && window.i18n["title"],
  getSearchLabel: () => window.i18n && window.i18n["search-label"],
  getBtnCancelLabel: () => window.i18n && window.i18n["btn-cancel"],
  getBtnValidateLabel: () => window.i18n && window.i18n["btn-validate"],
  getBtnShowAvatarsLabel: () => window.i18n && window.i18n["btn-show"],
  getSrcImages: () => getValue(`--${prefix}-url-images`) || baseUrlImages,
  getSrcCatImages: () =>
    getValue(`--${prefix}-url-images-cat`) || baseUrlFolders,
  getFilterLabel: () => window.i18n && window.i18n["filter-label"],
  getDefaultOptionLabel: () => window.i18n && window.i18n["default-option"],
  debug: () => {
    if (getValue(`--${prefix}-debug`)) {
      return true;
    }
    return false;
  },
  injectBtnModal: () => getValue(`--${prefix}-inject-btn`) || "#btnDeleteImage",
  selectedImage: null,
  prefix,
  fallbackUrl,
  avatarUrls: (searchTerm) => [
    { url: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${searchTerm}` },
    {
      url: `https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortFlat&facialHairType=BeardLight&seed=${searchTerm}`,
    },
    { url: `https://api.multiavatar.com/${searchTerm}.svg` },
    { url: `https://robohash.org/${searchTerm}.png` },
    {
      url: `https://ui-avatars.com/api/?name=${searchTerm}&background=random`,
    },
  ],
};

/* ===== style.js ===== */
const setCssProperties = (element, styles) => {
  for (let property in styles) {
    if (styles.hasOwnProperty(property)) {
      element.style[property] = styles[property];
    }
  }
};

const rippleStyle = `
  .lds-ripple, .lds-ripple div {
    box-sizing: border-box;
  }
  .lds-ripple {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
  }
  .lds-ripple div {
    position: absolute;
    border: 4px solid currentColor;
    opacity: 1;
    border-radius: 50%;
    animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  }
  .lds-ripple div:nth-child(2) {
    animation-delay: -0.5s;
  }
  @keyframes lds-ripple {
    0% { top: 36px; left: 36px; width: 8px; height: 8px; opacity: 0; }
    5% { top: 36px; left: 36px; width: 8px; height: 8px; opacity: 1; }
    100% { top: 0; left: 0; width: 80px; height: 80px; opacity: 0; }
  }
  @keyframes blink {
    from { transform: scale(0.1); opacity: 1;}
    to { transform: scale(1); opacity: 0;}
  }

  .blink {
    animation: blink 1s infinite;
  }
`;

const adjustResponsive = () => {
  const footer = document.getElementById(`${props.prefix}-footer-container`);
  const searchInput = document.getElementById(
    `${props.prefix}-search-container`
  );

  const gridContainer = document.getElementById(
    `${props.prefix}-grid-container`
  );

  const footerLeft = document.getElementById(`${props.prefix}-footer-left`);
  const footerRight = document.getElementById(`${props.prefix}-footer-right`);

  const windowWidth = window.innerWidth;

  if (windowWidth <= 500) {
    setCssProperties(footer, {
      flexDirection: "column",
      alignItems: "center",
    });
    setCssProperties(gridContainer, {
      maxHeight: "45vh",
    });
    setCssProperties(searchInput, {
      width: "100%",
    });

    setCssProperties(footerLeft, {
      flexDirection: "column",
    });
    setCssProperties(footerRight, {
      justifyContent: "center",
    });
  } else if (windowWidth <= 1024) {
    setCssProperties(footer, {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    });
    setCssProperties(gridContainer, {
      maxHeight: "60vh",
    });
    setCssProperties(searchInput, {
      width: "100%",
    });
    setCssProperties(footerLeft, {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      alignItems: "flex-start",
    });
    setCssProperties(footerRight, {
      display: "flex",
      justifyContent: "right",
      alignItems: "center",
      flexDirection: "column",
    });
  } else {
    setCssProperties(footer, {
      marginTop: "1em",
      display: "inline-flex",
      flexDirection: "row",
      gap: "10px",
      justifyContent: "space-between",
      width: "100%",
    });

    setCssProperties(footerLeft, {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
    });

    setCssProperties(footerRight, {
      display: "flex",
      width: "fit-content",
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
    });

    setCssProperties(gridContainer, {
      maxHeight: "60vh",
    });
    setCssProperties(searchInput, {
      width: "45%",
    });
  }
};

const injectStyles = () => {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = rippleStyle;
  document.head.appendChild(styleSheet);
};

/* ===== functions.js ===== */
const log = (...data) => {
  try {
    if (!props?.debug()) return;

    const timestamp = new Date().toLocaleString();

    console.group(
      `%c######### ${props.prefix} #########`,
      "color: #3498db; font-weight: bold;"
    );
    console.log(`%c${timestamp}`, "color: #2ecc71;");

    data.forEach((item) => {
      const type = typeof item;
      if (type === "object") {
        if (item === null) {
          console.log(null);
        } else if (Array.isArray(item)) {
          console.table(item);
        } else if (item instanceof Error) {
          console.error(item);
        } else {
          console.dir(item, { depth: null, colors: true });
        }
      } else {
        console.log(item);
      }
    });

    console.groupEnd();
  } catch (error) {
    console.error("An error occurred in the log function:", error);
  }
};

const getsrcImagesaved = () =>
  window.localStorage.getItem(`${props.prefix}-selected-img`) || null;

const toggleValidateButton = (img) => {
  const validateButton = document.querySelector(
    `button[id='${props.prefix}-btn-validate']`
  );

  img.onmouseover = () => ({});
  img.onmouseout = () => ({});

  setCssProperties(validateButton, { display: "block" });
  validateButton.onclick = () => onSelectImage(img.src);

  if (props.selectedImage) {
    setCssProperties(props.selectedImage, { filter: "brightness(0.5)" });
  }

  props.selectedImage = img;

  setCssProperties(props.selectedImage, { filter: "brightness(1)" });
};

const waitForElement = (
  selector,
  callback,
  interval = 100,
  timeout = 1000
) => {
  const start = Date.now();
  const checkExist = setInterval(() => {
    const element = document.querySelector(selector);
    const elapsed = Date.now() - start;
    log(`Wait Element ${selector}`);
    if (element) {
      log(`Element ${element?.id || element?.textContent} founded`);
      clearInterval(checkExist);
      callback();
    }
    if (elapsed >= timeout) {
      clearInterval(checkExist);
      log(`Element ${selector} not found within timeout period.`);
    }
  }, interval);
};

const getProfileImageUrl = () => {
  const element = document.querySelector(
    'div[class="headerButton headerButtonRight paper-icon-button-light headerUserButtonRound"]'
  );
  if (element) {
    return element.style.backgroundImage.split('"')[1];
  }
  return null;
};

const applyFilter = (by, base = []) => {
  return base.filter((str) => str.toLowerCase().includes(by));
};

const convertImageToBase64 = async (src) => {
  const response = await fetch(src);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const fetchImageBlob = async (src) => {
  const response = await fetch(src);
  if (!response.ok) throw new Error(`Unable to fetch image: ${response.status}`);
  const blob = await response.blob();
  const mime = blob.type || "image/png";
  return { blob, mime };
};

const onSelectImage = async (src) => {
  showRippleLoader();
  const credentialsRaw = localStorage.getItem("jellyfin_credentials");
  if (!credentialsRaw) {
    log("No jellyfin_credentials found in localStorage. Aborting upload.");
    if (document.getElementById(`${props.prefix}-modal`)) document.getElementById(`${props.prefix}-modal`).remove();
    if (document.getElementById(`${props.prefix}-backdrop-modal`)) document.getElementById(`${props.prefix}-backdrop-modal`).remove();
    return;
  }
  const credentials = JSON.parse(credentialsRaw);
  const server = credentials.Servers[0];
  const { AccessToken, UserId } = server;
  let DevicId = null;

  const hash = window.location.hash;
  const hashParams = new URLSearchParams(hash.split('?')[1] || '');
  const selectedUserId = hashParams.get('userId');
  const targetUserId = selectedUserId || UserId;

  log('onSelectImage called', { src, targetUserId, hasAccessToken: !!AccessToken, hasUserId: !!UserId });

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("_device")) {
      const value = localStorage.getItem(key);
      DevicId = value;
    }
  }

  let uploadSuccess = false;
  try {
    log('Preparing Jellyfin-compatible upload for', src);
    const { blob, mime } = await fetchImageBlob(src);
    log('Fetched blob for upload', { size: blob.size, mime });

    const serverOrigin = window.location.origin || (window.location.protocol + '//' + window.location.host);
    const postUrl = `${serverOrigin}/Users/${targetUserId}/Images/Primary`;

    const deviceIdForAuth = DevicId || btoa(navigator.userAgent);
    const clientVersion = "10.11.1";
    const mediaBrowserAuth = `MediaBrowser Client="Jellyfin Web", Device="Chrome", DeviceId="${deviceIdForAuth}", Version="${clientVersion}", Token="${AccessToken}"`;

    const headers = {
      Accept: "*/*",
      "Accept-Language": navigator.language || "en-GB,en;q=0.6",
      Authorization: mediaBrowserAuth,
      "X-Emby-Authorization": mediaBrowserAuth,
      "X-MediaBrowser-Token": AccessToken,
      "X-Emby-Token": AccessToken,
      "Content-Type": mime,
    };

    log('Uploading blob to Jellyfin API', postUrl, { headersSummary: { Authorization: !!headers.Authorization, ContentType: headers['Content-Type'] } });

    if (window.ApiClient && typeof window.ApiClient.uploadUserImage === 'function') {
      try {
        const ext = (mime.split('/')[1] || 'jpg').split(';')[0];
        const fileName = `avatar.${ext}`;
        const file = new File([blob], fileName, { type: mime });
        log('Calling window.ApiClient.uploadUserImage', { userId: targetUserId, fileName });
        await window.ApiClient.uploadUserImage(targetUserId, 'Primary', file);
        uploadSuccess = true;
        log('window.ApiClient.uploadUserImage succeeded');
      } catch (apiErr) {
        log('window.ApiClient.uploadUserImage failed, falling back to fetch:', apiErr);
      }
    }

    let res = null;
    if (!uploadSuccess) {
      res = await fetch(postUrl, {
        method: 'POST',
        headers,
        referrerPolicy: 'no-referrer',
        body: blob,
      });

      const respText = await res.text().catch(() => '');
      log('Fetch upload response:', res.status, res.statusText, respText);

      if (!res.ok) {
        throw new Error(`Upload failed: ${res.status} ${res.statusText} ${respText}`);
      }
      uploadSuccess = true;
      log('User image successfully updated (blob via fetch):', res.status, res.statusText);
    }

    if (!res || !res.ok) {
      // handled above
    }

    uploadSuccess = true;
    log("User image successfully updated (binary):", res && res.status, res && res.statusText);
  } catch (err) {
    log("Binary upload failed:", err);
  } finally {
    try {
      const backgroundImage = `url('${src}')`;
      const imageEl = document.getElementById("image");
      if (imageEl) setCssProperties(imageEl, { backgroundImage });

      if (uploadSuccess) {
        try {
          const serverUrl = await pollForServerImage(targetUserId, {
            retries: 8,
            interval: 1000,
            headers: {
              authorization: `MediaBrowser Client=\"Jellyfin Web\", Device=\"Chrome\", DeviceId=\"${DevicId}\", Version=\"10.9.11\", Token=\"${AccessToken}\"`,
              "X-Emby-Authorization": `MediaBrowser Client=\"Jellyfin Web\", Device=\"Chrome\", DeviceId=\"${DevicId}\", Version=\"10.9.11\", Token=\"${AccessToken}\"`,
              "X-MediaBrowser-Token": AccessToken,
            },
          });

          const finalUrl = serverUrl || `/Users/${targetUserId}/Images/Primary`;
          const cacheBusted = `${finalUrl}?v=${Date.now()}`;

          if (UserId == targetUserId) {
            const element = document.querySelector(".headerUserButton");
            if (element) {
              if (!element.classList.contains("headerUserButtonRound")) {
                element.classList.add("headerUserButtonRound");
              }
              element.innerHTML = `<div class="headerButton headerButtonRight paper-icon-button-light headerUserButtonRound" style="background-image:url('${cacheBusted}');"></div>`;
            }
          }

          window.localStorage.setItem(`${props.prefix}-selected-img`, finalUrl);
          const imageElServer = document.getElementById("image");
          if (imageElServer) setCssProperties(imageElServer, { backgroundImage: `url('${cacheBusted}')` });
        } catch (pollErr) {
          log('Polling for server image failed:', pollErr);
        }
      }

      if (document.getElementById(`${props.prefix}-modal`)) document.getElementById(`${props.prefix}-modal`).remove();
      if (document.getElementById(`${props.prefix}-backdrop-modal`)) document.getElementById(`${props.prefix}-backdrop-modal`).remove();
    } catch (uiErr) {
      log('Error during UI cleanup:', uiErr);
    }
  }
};

const addImagesToGrid = async (
  srcImages = [],
  imgGrid = createGridContainer()
) => {
  if (!(imgGrid instanceof HTMLElement)) {
    throw new Error("imgGrid must be a valid HTML element.");
  }
  showRippleLoader();

  let allImage = [];

  srcImages.forEach((img, idx) => {
    let url = img?.url || img?.imageUrl || img?.link || img?.src;
    allImage.push(createImage(url, idx));
  });
  if (props.selectedImage) {
    allImage.unshift(
      createImage(props.selectedImage.src, `selected-tmp`, true)
    );
  }

  const profileImageUrl = getProfileImageUrl();

  if (profileImageUrl) {
    allImage.unshift(createImage(profileImageUrl, `selected`, true));
  }

  if (allImage.length > 0) {
    setCssProperties(imgGrid, {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
      gap: "10px",
      padding: "15px",
    });
    imgGrid.innerHTML = "";
    allImage.forEach((image) => imgGrid.appendChild(image));
  } else {
    log("No more srcImages available.");
  }
};

const loadSrcImages = async () => {
  let pathCustom = props.getSrcImages();
  const storageKey = `${props.prefix}-srcImages`;
  const storedData = localStorage.getItem(storageKey);

  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);
      const storedDate = new Date(parsedData.timestamp);
      const currentDate = new Date();
      const oneDayInMs = 24 * 60 * 60 * 1000;
      if (
        currentDate - storedDate < oneDayInMs &&
        parsedData.src === pathCustom
      ) {
        log(
          `Using cached srcImages (${parsedData.data.length}) from localStorage`
        );
        return parsedData.data;
      }
    } catch (e) {
      log("Error parsing stored data:", e);
    }
  }

  try {
    const data = await tryLoadJson(pathCustom);
    log(`srcImages loaded ${data.length}`);

    const storageData = {
      src: pathCustom,
      timestamp: new Date().toISOString(),
      data,
    };

    localStorage.setItem(storageKey, JSON.stringify(storageData));
    return data;
  } catch (error) {
    log("Error:", error);
    return [];
  }
};

const loadLanguage = async () => {
  const userLang = navigator.language.split("-")[0];
  const defaultLang = "en";

  let selectedLang = userLang;
  let translations = {};

  const loadJson = async (lang) => {
    const localUrl = `jf-avatars/src/lang/${lang}.json`;
    const fallbackUrlLocal = `${props.fallbackUrl}/${lang}.json`;

    let data = await tryLoadJson(localUrl);
    if (!data) {
      log(`Attempting to load from GitHub...`);
      data = await tryLoadJson(fallbackUrlLocal);
    }

    return data;
  };

  translations = await loadJson(selectedLang);
  if (!translations) translations = await loadJson(defaultLang);
  if (!translations) {
    log("Unable to load language files.");
    translations = {};
  }
  window.i18n = translations;
};

const tryLoadJson = async (url, cache = "no-store") => {
  try {
    log(`Attempting to load: ${url}`);
    const response = await fetch(url, { cache });
    if (!response.ok) throw new Error(`File ${url} not found`);

    const data = await response.json();
    log("JSON loaded:", data);
    return data;
  } catch (error) {
    log(`Error loading from: ${url}, ${error.message}`);
    return null;
  }
};

const pollForServerImage = async (
  userId,
  { retries = 6, interval = 1000, headers = {} } = {}
) => {
  const url = `/Users/${userId}/Images/Primary`;
  const origin = window.location.origin || (window.location.protocol + '//' + window.location.host);
  const pollUrl = `${origin}/Users/${userId}/Images/Primary`;
  for (let i = 0; i < retries; i++) {
    try {
      const resp = await fetch(`${pollUrl}?v=${Date.now()}`, {
        method: "GET",
        cache: "no-store",
        headers,
      });
      const ctype = resp.headers.get("content-type") || "";
      if (resp.ok && ctype.startsWith("image/")) {
        log(`Server image available (attempt ${i + 1}):`, resp.status, ctype);
        return url;
      }
      log(`Server image not ready (attempt ${i + 1}):`, resp.status, ctype);
    } catch (err) {
      log(`Error checking server image (attempt ${i + 1}):`, err.message || err);
    }
    await new Promise((r) => setTimeout(r, interval));
  }
  return null;
};

const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.right <= window.innerWidth
  );
};

/* ===== preload.js ===== */
const MAX_CONCURRENT_LOADS = 100;
const LOAD_PRIORITY_VIEWPORT = true;

class ImageLoadQueue {
  constructor(maxConcurrent = 4) {
    this.queue = [];
    this.activeLoads = 0;
    this.maxConcurrent = maxConcurrent;
  }

  add(loadTask, priority = 10) {
    this.queue.push({ loadTask, priority });
    this.queue.sort((a, b) => a.priority - b.priority);
    this.processQueue();
  }

  processQueue() {
    if (this.activeLoads >= this.maxConcurrent || this.queue.length === 0)
      return;

    const { loadTask } = this.queue.shift();
    this.activeLoads++;

    Promise.resolve(loadTask())
      .catch((error) => log(`Image load error: ${error}`))
      .finally(() => {
        this.activeLoads--;
        this.processQueue();
      });
  }
}

const imageQueue = new ImageLoadQueue(MAX_CONCURRENT_LOADS);

const calculateLoadPriority = (img) => {
  if (!LOAD_PRIORITY_VIEWPORT) return 10;
  const rect = img.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  if (rect.top < windowHeight && rect.bottom > 0) {
    const distanceFromCenter = Math.abs(
      (rect.top + rect.bottom) / 2 - windowHeight / 2
    );
    return Math.floor(distanceFromCenter / 100);
  }

  return 20 + Math.floor(rect.top / 100);
};

const loadImageWithPriority = (img, actualSrc) => {
  const priority = calculateLoadPriority(img);

  imageQueue.add(() => {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => {
        img.src = actualSrc;
        img.classList.remove("blink");
        setCssProperties(img, { cursor: "pointer" });
        setupImageInteractions(img);
        resolve();
      };

      image.onerror = () => {
        log(`Image failed to load: ${actualSrc}`);
        img.remove();
        reject(new Error(`Failed to load image: ${actualSrc}`));
      };

      image.src = actualSrc;
    });
  }, priority);
};

const setupImageInteractions = (img) => {
  img.onmouseover = ({ target }) => {
    if (
      (props.selectedImage && props.selectedImage.src === target.src) ||
      target.id === `${props.prefix}-img-selected`
    )
      return;

    setCssProperties(img, {
      transform: "scale(1.1)",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
      filter: "brightness(1)",
    });
  };

  img.onmouseout = ({ target }) => {
    if (
      (props.selectedImage && props.selectedImage.src === target.src) ||
      target.id === `${props.prefix}-img-selected`
    )
      return;

    setCssProperties(img, {
      transform: "scale(1)",
      boxShadow: "none",
      filter: "brightness(0.5)",
    });
  };

  img.onclick = ({ target }) => {
    if (!target.src.endsWith(props.imageName)) {
      log(`Clicked img ${img.id}`);
      toggleValidateButton(img);
    }
  };
};

const preloadImportantImages = async (images, count = 6) => {
  const imagesToPreload = images.slice(0, count);

  imagesToPreload.forEach((img, index) => {
    setTimeout(() => {
      const image = new Image();
      image.src = img.url;
      log(`Preloading important image #${index + 1}: ${img.url}`);
    }, index * 50);
  });
};

/* ===== ui-elements.js ===== */
const createButton = ({
  id = "createButton",
  textContent = `${props.prefix}-btn`,
  display = "block",
  onClick = () => ({}),
} = {}) => {
  let idx = `${props.prefix}-btn-${id}`;
  let btnExist = document.getElementById(idx);
  if (btnExist) {
    return btnExist;
  }

  let customBtn = document.createElement("button");
  customBtn.textContent = textContent;
  customBtn.id = idx;
  customBtn.className = "raised button-submit emby-button";
  customBtn.onclick = onClick;
  setCssProperties(customBtn, {
    width: "max-content",
    display: display,
  });

  return customBtn;
};

const createSearchBar = (domElement) => {
  let searchDiv = document.createElement("div");
  setCssProperties(searchDiv, { width: "auto" });
  searchDiv.id = `${props.prefix}-search-container`;

  let searchLabel = document.createElement("label");
  searchLabel.classList.add(
    "inputLabel",
    "inputLabel-float",
    "inputLabelUnfocused"
  );
  searchLabel.setAttribute("for", `${props.prefix}-search-input`);
  searchLabel.textContent = props.getSearchLabel();

  let searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.id = `${props.prefix}-search-input`;
  searchInput.placeholder = props.getSearchLabel();
  searchInput.autocomplete = "off";
  searchInput.classList.add("emby-input");

  searchDiv.appendChild(searchLabel);
  searchDiv.appendChild(searchInput);

  domElement.appendChild(searchDiv);
};

const rippleLoader = () => {
  let id = `${props.prefix}-ripple-loader`;
  let loaderExist = document.getElementById(id);
  if (loaderExist) {
    return loaderExist;
  } else {
    let loader = document.createElement("div");
    loader.id = id;
    loader.className = "lds-ripple";
    loader.innerHTML = "<div></div><div></div>";
    return loader;
  }
};

const showRippleLoader = () => {
  let grid = createGridContainer();
  let loader = rippleLoader();
  setCssProperties(grid, {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });
  grid.replaceChildren(loader);
  return loader;
};

const createFooter = async (domElement) => {
  let footer = document.createElement("div");
  footer.id = `${props.prefix}-footer-container`;
  setCssProperties(footer, {
    marginTop: "1em",
    display: "flex",
    flexDirection: "row",
    gap: "10px",
    justifyContent: "center",
    alignItems: "stretch",
  });

  let footerLeft = document.createElement("div");
  footerLeft.id = `${props.prefix}-footer-left`;
  setCssProperties(footerLeft, {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  });
  createRandomBtn(footerLeft);
  createDropdown(footerLeft);
  createSearchBar(footerLeft);

  footer.appendChild(footerLeft);

  let footerRight = document.createElement("div");
  footerRight.id = `${props.prefix}-footer-right`;
  setCssProperties(footerRight, {
    width: "20%",
    display: "flex",
    justifyContent: "end",
  });
  footerRight.appendChild(
    createButton({
      id: "cancel",
      textContent: props.getBtnCancelLabel(),
      onClick: () => {
        props.selectedImage = null;
        document.getElementById(`${props.prefix}-modal`).remove();
        document.getElementById(`${props.prefix}-backdrop-modal`).remove();
      },
    })
  );
  footerRight.appendChild(
    createButton({
      id: "validate",
      textContent: props.getBtnValidateLabel(),
      display: "none",
    })
  );
  footer.appendChild(footerRight);

  domElement.appendChild(footer);
};

const createImage = (url, idx, isSelected = false) => {
  let img = document.createElement("img");
  img.alt = `${props.prefix} img ${idx}`;
  img.className = `blink lazy-image ${props.prefix}-img`;
  img.id = `${props.prefix}-img-${idx}`;
  img.loading = "lazy";
  img.setAttribute("data-src", url);

  setCssProperties(img, {
    borderRadius: "100%",
    width: "100px",
    height: "100px",
    margin: "auto",
    backgroundSize: "cover",
    transition: "transform 0.2s, box-shadow 0.2s, background-color 0.2s",
    filter: isSelected ? "brightness(1)" : "brightness(0.5)",
    backgroundColor: "currentColor",
    color: "currentColor",
  });
  return img;
};

const createGridContainer = () => {
  let id = `${props.prefix}-grid-container`;
  let imgGridExist = document.getElementById(id);
  if (imgGridExist) {
    return imgGridExist;
  } else {
    let imgGrid = document.createElement("div");
    imgGrid.id = id;
    imgGrid.classList.add("image-grid");
    setCssProperties(imgGrid, {
      overflow: "auto",
      maxHeight: "60vh",
      overflowX: "hidden",
    });
    return imgGrid;
  }
};

const createModal = async () => {
  if (!props.getTitle()) {
    throw new Error(
      "The title of the modal must be defined in props.getTitle()."
    );
  }

  let srcImages = await loadSrcImages();
  let modal = document.createElement("div");
  modal.classList.add(
    "dialogContainer",
    "focuscontainer",
    "dialog",
    "smoothScrollY",
    "ui-body-a",
    "background-theme-a",
    "formDialog",
    "centeredDialog",
    "opened",
    "actionsheet-not-fullscreen",
    "actionSheet"
  );
  modal.setAttribute("data-lockscroll", "true");
  modal.setAttribute("data-history", "true");
  modal.setAttribute("data-autofocus", "true");
  modal.setAttribute("data-removeonclose", "true");
  setCssProperties(modal, {
    animation: "160ms ease-out 0s 1 normal both running scaleup",
    margin: "95px 50px 0 50px",
  });
  modal.id = `${props.prefix}-modal`;

  let content = document.createElement("div");
  setCssProperties(content, {
    margin: "0",
    padding: "1.25em 0.5em 1.25em 0.5em",
    width: "95%",
    height: "95%",
  });

  let title = document.createElement("h2");
  setCssProperties(title, { margin: "0 0 .5em" });
  title.textContent = props.getTitle();
  content.appendChild(title);

  let imgGrid = createGridContainer();
  content.appendChild(imgGrid);

  addImagesToGrid(srcImages, imgGrid);
  createFooter(content);

  modal.appendChild(content);
  let modalbackdrop = document.createElement("div");
  modalbackdrop.id = `${props.prefix}-backdrop-modal`;
  modalbackdrop.className = "dialogBackdrop dialogBackdropOpened";
  document.body.appendChild(modalbackdrop);
  document.body.appendChild(modal);

  adjustResponsive();
  eventListener();
};

const createDropdown = (domElement) => {
  let idx = `${props.prefix}-dropdown-filter`;
  let dropdownExist = document.getElementById(idx);
  if (dropdownExist) {
    return dropdownExist;
  }

  let dropdownContainer = document.createElement("div");
  dropdownContainer.id = idx;
  dropdownContainer.className = `${props.prefix}-dropdown-container`;
  setCssProperties(dropdownContainer, { width: "45%" });

  let dropdownLabel = document.createElement("label");
  dropdownLabel.classList.add(
    "inputLabel",
    "inputLabel-float",
    "inputLabelUnfocused"
  );
  dropdownLabel.setAttribute("for", `${props.prefix}-dropdown-select-filter`);
  dropdownLabel.textContent = props.getFilterLabel();

  let select = document.createElement("select");
  select.id = `${props.prefix}-dropdown-select-filter`;
  select.classList.add("emby-select");

  tryLoadJson(props.getSrcCatImages()).then((folders_names) => {
    const optionAll = props.getDefaultOptionLabel();

    [optionAll, ...folders_names].forEach((item) => {
      let option = document.createElement("option");
      option.value = item;
      option.textContent = item;
      if (item === optionAll) {
        option.selected = true;
        applySearchAndFilters({ target: { value: item } });
      }
      select.appendChild(option);
    });
    dropdownLabel.classList.remove("inputLabelUnfocused");
    dropdownLabel.classList.add("inputLabelFocused");
  });

  setCssProperties(select, {
    width: "100%",
  });

  dropdownContainer.appendChild(dropdownLabel);
  dropdownContainer.appendChild(select);

  select.addEventListener("focus", () => {
    dropdownLabel.classList.remove("inputLabelUnfocused");
    dropdownLabel.classList.add("inputLabelFocused");
  });

  select.addEventListener("blur", () => {
    if (!select.value) {
      dropdownLabel.classList.remove("inputLabelFocused");
      dropdownLabel.classList.add("inputLabelUnfocused");
    }
  });

  domElement.appendChild(dropdownContainer);
};

const createRandomBtn = (domElement) => {
  let randomBtnExist = document.getElementById(`${props.prefix}-btn-random`);
  if (randomBtnExist) {
    return randomBtnExist;
  }

  const randomBtn = document.createElement("button");
  randomBtn.id = `${props.prefix}-btn-random`;
  randomBtn.setAttribute("is", "emby-button");
  randomBtn.setAttribute("type", "button");
  randomBtn.setAttribute("class", "button-flat detailButton emby-button");

  const div = document.createElement("div");

  div.setAttribute("class", "detailButton-content");

  const span = document.createElement("span");
  span.setAttribute("class", "material-icons detailButton-icon shuffle ");
  span.setAttribute("aria-hidden", "true");

  randomBtn.onclick = () => {
    let images = document.querySelectorAll(
      `#${props.prefix}-grid-container>img`
    );

    let randomImage = images[Math.floor(Math.random() * images.length)];

    randomImage.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "center",
    });

    document.getElementById(randomImage.id).click();
  };

  div.appendChild(span);
  randomBtn.appendChild(div);
  domElement.appendChild(randomBtn);
};

/* ===== events.js ===== */
const intersectionObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      const actualSrc = img.getAttribute("data-src");
      loadImageWithPriority(img, actualSrc);
      observer.unobserve(img);
    }
  });
});

let lazyImages = () => document.querySelectorAll(".lazy-image");

const applySearchAndFilters = async (event) => {
  let searchTerm = event.target?.value?.toLowerCase();
  let selectedCategory = event.target?.value;
  const isSearchInput = event.target?.id?.includes('search-input');
  const isDropdown = event.target?.id?.includes('dropdown-select-filter');
  const searchInput = document.querySelector(`#${props.prefix}-search-input`);
  const dropdownSelect = document.querySelector(`#${props.prefix}-dropdown-select-filter`);
  const currentSearchTerm = searchInput?.value?.toLowerCase() || "";
  const currentCategory = dropdownSelect?.value || "";
  showRippleLoader();

  const allSrcImages = (await loadSrcImages()) || [];

  let filteredSrcImages = allSrcImages;

  if (currentCategory && currentCategory !== props.getDefaultOptionLabel()) {
    filteredSrcImages = filteredSrcImages.filter((img) => {
      const category = img.category || img.folder || "";
      return category.toLowerCase().includes(currentCategory.toLowerCase());
    });
  }

  if (currentSearchTerm && currentSearchTerm.trim() !== "") {
    filteredSrcImages = filteredSrcImages.filter((img) => {
      const url = img.url || "";
      const name = img.name || "";
      log("Search term:", currentSearchTerm);
      log("Image:", img);
      return url.toLowerCase().includes(currentSearchTerm) || 
             name.toLowerCase().includes(currentSearchTerm);
    });
  }

  const imgGrid = document.querySelector(`#${props.prefix}-grid-container`);

  if (filteredSrcImages.length > 0) {
    preloadImportantImages(filteredSrcImages);
    if (imgGrid) {
      addImagesToGrid(filteredSrcImages, imgGrid);
      lazyImages().forEach((img) => {
        if (isInViewport(img)) {
          const actualSrc = img.getAttribute("data-src");
          loadImageWithPriority(img, actualSrc);
        } else {
          intersectionObserver.observe(img);
        }
      });
    }
  } else {
    addImagesToGrid(props.avatarUrls(currentSearchTerm), imgGrid);
    lazyImages().forEach((img) => {
      if (isInViewport(img)) {
        const actualSrc = img.getAttribute("data-src");
        loadImageWithPriority(img, actualSrc);
      } else {
        intersectionObserver.observe(img);
      }
    });
  }
};

const eventListener = () => {
  const searchBar = document.querySelector(`#${props.prefix}-search-input`);
  const dropdown = document.querySelector(
    `#${props.prefix}-dropdown-select-filter`
  );

  if (searchBar) searchBar.addEventListener("input", applySearchAndFilters);
  if (dropdown) dropdown.addEventListener("change", applySearchAndFilters);
  window.addEventListener("resize", adjustResponsive);

  lazyImages().forEach((img) => {
    if (isInViewport(img)) {
      const actualSrc = img.getAttribute("data-src");
      loadImageWithPriority(img, actualSrc);
    } else {
      intersectionObserver.observe(img);
    }
  });
};

/* ===== index.js (entry) ===== */
const addProfileButton = () => {
  log("Attempting to add button");
  if (!document.getElementById(`${props.prefix}-btn-show-modal`)) {
    const selector = props.injectBtnModal();
    injectStyles();
    const target = document.querySelector(selector);
    if (target) {
      target.before(
        createButton({
          id: "show-modal",
          textContent: props.getBtnShowAvatarsLabel(),
          onClick: () => createModal(),
        })
      );
      log("Button injected");
      ensurePersistentObserver();
      return;
    }

    waitForElement(
      selector,
      () => {
        const el = document.querySelector(selector);
        if (!el) return;
        el.before(
          createButton({
            id: "show-modal",
            textContent: props.getBtnShowAvatarsLabel(),
            onClick: () => createModal(),
          })
        );
        log("Button injected (wait)");
        ensurePersistentObserver();
      },
      200,
      5000
    );

    const ro = new MutationObserver((mutations, obs) => {
      const el = document.querySelector(selector);
      if (el) {
        if (!document.getElementById(`${props.prefix}-btn-show-modal`)) {
          el.before(
            createButton({
              id: "show-modal",
              textContent: props.getBtnShowAvatarsLabel(),
              onClick: () => createModal(),
            })
          );
          log("Button injected (observer fallback)");
          ensurePersistentObserver();
        }
        obs.disconnect();
      }
    });
    ro.observe(document.body, { childList: true, subtree: true });
  } else {
    log("Button already exists");
  }
};

let persistentObserver = null;
const ensurePersistentObserver = () => {
  if (persistentObserver) return;

  persistentObserver = new MutationObserver(() => {
    try {
      if (!window.location.hash.includes("#/userprofile")) return;
      const btnId = `${props.prefix}-btn-show-modal`;
      if (!document.getElementById(btnId)) {
        const selector = props.injectBtnModal();
        const el = document.querySelector(selector);
        if (el) {
          el.before(
            createButton({
              id: "show-modal",
              textContent: props.getBtnShowAvatarsLabel(),
              onClick: () => createModal(),
            })
          );
          log("Button re-inserted by persistentObserver");
        }
      }
    } catch (err) {
      log('persistentObserver error', err);
    }
  });

  persistentObserver.observe(document.body, { childList: true, subtree: true });
};

const observeDOMChanges = () => {
  log("Attempting to observe dom changes");
  const targetNode = document.body;
  const config = { childList: true, subtree: true };

  const callback = (mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        if (window.location.hash.includes("#/userprofile")) {
          addProfileButton()
          observerDisconnect();
        }
      }
    }
  };

  log("Navigation to userprofile detected.");
  loadLanguage().then(() => {
    if (window.location.hash.includes("#/userprofile")) {
      addProfileButton();
      return;
    }

    const observerLocal = new MutationObserver(callback);
    observerLocal.observe(targetNode, config);

    // helper to disconnect from outside
    window.__jfAvObserver = observerLocal;
  });
};

const observerDisconnect = () => {
  if (window.__jfAvObserver && typeof window.__jfAvObserver.disconnect === 'function') {
    window.__jfAvObserver.disconnect();
  }
};

const mutationObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.id === "cssBranding" || node.textContent === "Profile") {
        observeDOMChanges();
        mutationObserver.disconnect();
      }
    });
  });
});

observeDOMChanges();
mutationObserver.observe(document.body, { childList: true, subtree: true });

/* Optionally expose some helpers for debugging */
window.jfAv = {
  props,
  createModal,
  createButton,
  loadLanguage,
  injectStyles,
};

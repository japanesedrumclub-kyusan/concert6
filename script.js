/* ===============================
   タブ切り替え
================================ */
const tabs = document.querySelectorAll(".tab");
const programLists = document.querySelectorAll(".program-list");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    const targetId = tab.dataset.target;
    programLists.forEach((list) => {
      list.classList.toggle("hidden", list.id !== targetId);
    });

    setupSongToggle();
  });
});

/* ===============================
   曲説明トグル
================================ */
function setupSongToggle() {
  const songs = document.querySelectorAll(".program-list:not(.hidden) .song");

  songs.forEach((song) => {
    const toggle = song.querySelector(".toggle");
    if (!toggle) return;

    toggle.onclick = (e) => {
  e.stopPropagation();

  const isOpen = song.classList.contains("open");

  // いったん全部閉じる
  songs.forEach((s) => s.classList.remove("open"));

  // もともと閉じてた場合だけ開く
  if (!isOpen) {
    song.classList.add("open");
  }
};
  });
}
setupSongToggle();

/* ===============================
   MEMBER モーダル（モード管理）
================================ */
const memberBtn = document.getElementById("memberBtn");
const memberModal = document.getElementById("memberModal");
const closeMember = document.getElementById("closeMember");
const gradeNav = document.getElementById("gradeNav");
const gradeTitles = document.querySelectorAll(".grade-title");

const MODE = {
  MEMBER: "member",
};

/* ===== 初期化 ===== */
function resetMemberModal() {
  document.querySelectorAll(".member").forEach((m) => {
    m.style.display = "block";
  });
}

/* ===== モーダルを開く ===== */
function openMemberModal(mode) {
  resetMemberModal();

  memberModal.classList.remove("member-mode", "song-mode");
  memberModal.classList.add(mode + "-mode");
  memberModal.classList.remove("hidden");
}

/* ===== 閉じる ===== */
function closeMemberModal() {
  memberModal.classList.add("hidden");
  resetMemberModal();
}

closeMember.addEventListener("click", closeMemberModal);
memberModal.addEventListener("click", (e) => {
  if (e.target === memberModal) closeMemberModal();
});

/* ===============================
   MEMBER ボタン
================================ */
memberBtn.addEventListener("click", () => {
  openMemberModal(MODE.MEMBER);
});

/* ===============================
   人 → 曲
================================ */
document.querySelectorAll(".member").forEach((member) => {
  member.addEventListener("click", () => {

    const songs = member.dataset.songs.split(" ");
    const name = member.textContent.trim();

    // ===== 学年判定（←ここ重要！）=====
    const grade = name.charAt(0);

    const noMsg = document.getElementById("noAppearanceMsg");

    if (grade === "1" || grade === "2") {
      noMsg.classList.remove("hidden");
    } else {
      noMsg.classList.add("hidden");
    }

    // ===== 曲フィルタ =====
    document.querySelectorAll(".song").forEach((song) => {
      song.style.display =
        songs.includes(song.dataset.song) ? "block" : "none";
    });

    closeMemberModal();

    // ヒーロー書き換え
    document.getElementById("heroTitle").textContent = name;
    document.getElementById("hellow").innerHTML =
      "▶ この部員の出演曲を表示中";
      updateStar(name);
  });
});

/* ===============================
   SEARCH モーダル
================================ */
const searchBtn = document.getElementById("searchBtn");
const searchModal = document.getElementById("searchModal");
const closeSearch = document.getElementById("closeSearch");

searchBtn.addEventListener("click", () => {
  searchModal.classList.remove("hidden");
});

closeSearch.addEventListener("click", () => {
  searchModal.classList.add("hidden");
});

searchModal.addEventListener("click", (e) => {
  if (e.target === searchModal) searchModal.classList.add("hidden");
});

/* ===============================
   SEARCH 処理
================================ */
const gradeInput = document.getElementById("searchGrade");
const classInput = document.getElementById("searchClass");
const nameInput = document.getElementById("searchName");
const resultsBox = document.getElementById("searchResults");

function runSearch() {
  const grade = gradeInput.value;
  const cls = classInput.value.trim();
  const name = nameInput.value.trim();

  resultsBox.innerHTML = "";
  if (!grade && !cls && !name) return;

  document.querySelectorAll(".member").forEach((member) => {
    const text = member.textContent;

    const clean = text.trim();   // 先頭の見えないスペース対策

const ok =
  (!grade || clean.startsWith(grade)) &&
  (!cls || clean.includes(cls + "組")) &&
  (!name || clean.includes(name));

    if (ok) {
      const div = document.createElement("div");
      div.className = "search-result";
      div.textContent = text;
      div.dataset.songs = member.dataset.songs;
      resultsBox.appendChild(div);
    }
  });
}

[gradeInput, classInput, nameInput].forEach((el) =>
  el.addEventListener("input", runSearch),
);

resultsBox.addEventListener("click", e => {
  const item = e.target.closest(".search-result");
  if (!item) return;

  const songs = item.dataset.songs.split(" ");
  const text = item.textContent.trim();   // ← これ超大事

  searchModal.classList.add("hidden");

  // ===== 学年を“確実に”取得 =====
  const grade = text.trim().charAt(0);

  const tab1 = document.querySelector('[data-target="concert6"]');
  const tab2 = document.querySelector('[data-target="graduation11"]');

// ===== 第2部メッセージ制御 =====
const noMsg = document.getElementById("noAppearanceMsg");

if (grade === "1" || grade === "2") {

  // メッセージ表示
  noMsg.classList.remove("hidden");

} else {

  // 3年はメッセージ消す
  noMsg.classList.add("hidden");

}

  // ===== 曲フィルタ =====
  document.querySelectorAll(".song").forEach(song => {
    song.style.display =
      songs.includes(song.dataset.song) ? "block" : "none";
  });

  //ヒーロー部分書き換え
  document.getElementById("heroTitle").textContent = item.textContent;
  document.getElementById("heroSub").innerHTML =
    "Members of the Kyushu Sangyo High School Japanese Drum Club";
  document.getElementById("hellow").innerHTML = "▶ この部員の出演曲を表示中";
});

/* ===============================
   HOME（修正版）
================================ */

document.getElementById("homeBtn").addEventListener("click", () => {

  document.querySelector('[data-target="graduation11"]').style.display = "";

  document.querySelectorAll(".song").forEach((song) => {
    song.style.display = "block";
  });

  document.getElementById("hellow").textContent = "The 6th Annual Concert of";
  document.getElementById("heroTitle").textContent = "SHIENRAKU";
  
  updateStar("SHIENRAKU");
  
  document.getElementById("heroSub").innerHTML = `
    The Japanese Drum Club<br>
    of Kyushu Sangyo High School.
  `;
});

document.querySelectorAll(".grade-nav button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const grade = btn.dataset.grade;

    if (grade === "all") {
      memberModal
        .querySelector(".member-list")
        .scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const target = memberModal.querySelector(
      `.grade-group[data-grade="${grade}"]`,
    );

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

/* ===============================
   HISTORY 切り替え（最終安全版）
================================ */

// 要素取得（存在チェックつき）
const historyBtn = document.getElementById("historyBtn");
const homeBtn    = document.getElementById("homeBtn");

const hero     = document.querySelector(".hero");
const tabsArea = document.querySelector(".tabs");
const program  = document.querySelector(".program");
const history  = document.getElementById("historySection");

console.log("診断:", {
  historyBtn, homeBtn, hero, tabsArea, program, history
});

// ===== HISTORYを開く =====
if (historyBtn) {
  historyBtn.addEventListener("click", () => {
    hero.classList.add("hidden");
    tabsArea.classList.add("hidden");
    program.classList.add("hidden");

    history.classList.remove("hidden");
  });
}

// ===== HOMEで戻る =====
if (homeBtn) {
  homeBtn.addEventListener("click", () => {
    history.classList.add("hidden");

    hero.classList.remove("hidden");
    tabsArea.classList.remove("hidden");
    program.classList.remove("hidden");
    
    // --- ① 第2部を元通り表示 ---
  document.querySelector('[data-target="graduation11"]').style.display = "";

  // --- ② すべての曲を表示 ---
  document.querySelectorAll(".song").forEach((song) => {
    song.style.display = "block";
  });

  // --- ★★★ ここが今回の本命 ★★★ ---
  const noMsg = document.getElementById("noAppearanceMsg");
  if (noMsg) {
    noMsg.classList.add("hidden");   // メッセージを消す！
  }
  // --- ★★★ ここまで ★★★ ---

  // --- ③ ヒーロー表示を初期に戻す ---
  document.getElementById("hellow").textContent =
    "The 6th Annual Concert of";

  document.getElementById("heroTitle").textContent =
    "SHIENRAKU";

  document.getElementById("heroSub").innerHTML = `
    The Japanese Drum Club<br>
    of Kyushu Sangyo High School.`;
    
    updateStar("SHIENRAKU");
  });
}

// ===== ポリシー表示 =====
document.getElementById("openPolicy").onclick = () =>
  document.getElementById("policyModal").classList.remove("hidden");

document.getElementById("closePolicy").onclick = () =>
  document.getElementById("policyModal").classList.add("hidden");

// ===== 利用規約 =====
document.getElementById("openTerms").onclick = () =>
  document.getElementById("termsModal").classList.remove("hidden");

document.getElementById("closeTerms").onclick = () =>
  document.getElementById("termsModal").classList.add("hidden");
  
/* ===============================
   OPENING（ボタン式）
================================ */

document.addEventListener("DOMContentLoaded", () => {

  const opening = document.getElementById("opening");
  const openingImage = document.getElementById("openingImage");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const helpBtn = document.querySelector(".icon");

  if (!opening) return;

  const slides = ["https://i.postimg.cc/d1z39Yng/IMG-0029.jpg", "https://i.postimg.cc/15S5RMTP/IMG-0027.jpg", "https://i.postimg.cc/k48qqtvC/IMG-0030.jpg", "https://i.postimg.cc/1XshS7zd/IMG-0031.jpg"];
  let current = 0;

  function updateSlide() {
    openingImage.src = slides[current];

    prevBtn.style.visibility =
      current === 0 ? "hidden" : "visible";

    nextBtn.textContent =
      current === slides.length - 1
        ? "ホームへ"
        : "次へ →";
  }

  prevBtn.addEventListener("click", () => {
    if (current > 0) {
      current--;
      updateSlide();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (current < slides.length - 1) {
      current++;
      updateSlide();
    } else {
      opening.classList.add("hidden");
      localStorage.setItem("visited", "true");
    }
  });

  // 初回だけ表示
  if (!localStorage.getItem("visited")) {
    opening.classList.remove("hidden");
  }

  // ?ボタンで再表示
  if (helpBtn) {
    helpBtn.addEventListener("click", () => {
      opening.classList.remove("hidden");
      current = 0;
      updateSlide();
    });
  }

  updateSlide();
});
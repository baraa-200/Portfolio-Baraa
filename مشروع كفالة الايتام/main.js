// مصفوفة لتخزين الأيتام بشكل ديناميكي
let orphansList = [];

// عناصر الصفحة الأساسية
const orphanForm = document.getElementById('orphanForm');
const healthStatusSelect = document.getElementById('healthStatus');
const illnessContainer = document.getElementById('illnessDescriptionContainer');
const emptyState = document.getElementById('emptyState');

// 1. مراقبة الحالة الصحية لإظهار/إخفاء حقل المرض تلقائياً وبسلاسة
healthStatusSelect.addEventListener('change', function() {
  if (this.value === 'مريض') {
    illnessContainer.classList.remove('d-none');
    document.getElementById('illnessDescription').setAttribute('required', 'true');
  } else {
    illnessContainer.classList.add('d-none');
    document.getElementById('illnessDescription').removeAttribute('required');
    document.getElementById('illnessDescription').value = ''; // تفريغ الحقل
  }
});

// 2. معالجة إرسال النموذج وإضافة يتيم جديد
orphanForm.addEventListener('submit', function(e) {
  e.preventDefault();

  // جلب القيم من المدخلات
  const orphan = {
    id: Date.now(), // معرف فريد لكل يتيم لتسهيل الحذف والبحث
    name: document.getElementById('nameInput').value,
    age: document.getElementById('ageInput').value,
    gender: document.getElementById('genderInput').value,
    status: document.getElementById('statusInput').value
  };

  // إضافة الكائن إلى المصفوفة
  orphansList.push(orphan);

  // تحديث الواجهة والعدادات
  renderTable();
  updateDashboardCounters();

  // إعادة تعيين النموذج وإخفاء حقل المرض إن كان ظاهراً
  this.reset();
  illnessContainer.classList.add('d-none');
});

// 3. دالة بناء ورسم الجدول بناءً على البيانات الحالية
function renderTable() {
  const tableBody = document.getElementById('orphansTable');
  tableBody.innerHTML = ''; // تفريغ الجدول أولاً

  if (orphansList.length === 0) {
    emptyState.classList.remove('d-none');
    return;
  } else {
    emptyState.classList.add('d-none');
  }

  orphansList.forEach((orphan, index) => {
    const row = document.createElement('tr');
    row.className = 'animate-row'; // إضافة تأثير حركي عند الظهور

    const badgeClass = orphan.status === 'مكفول' ? 'bg-success-soft text-success' : 'bg-warning-soft text-warning';

    row.innerHTML = `
      <td class="fw-bold">${index + 1}</td>
      <td>${orphan.name}</td>
      <td>${orphan.age} سنة</td>
      <td>${orphan.gender}</td>
      <td><span class="badge ${badgeClass}">${orphan.status}</span></td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-1" onclick="viewOrphan(${orphan.id})"><i class="bi bi-eye"></i></button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteOrphan(${orphan.id})"><i class="bi bi-trash"></i></button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// 4. دالة تحديث عدادات لوحة التحكم بشكل صحيح
function updateDashboardCounters() {
  const totalOrphans = orphansList.length;
  const sponsoredCount = orphansList.filter(o => o.status === 'مكفول').length;
  const pendingCount = orphansList.filter(o => o.status === 'غير مكفول').length;

  document.getElementById('orphansCount').textContent = totalOrphans;
  document.getElementById('sponsorsCount').textContent = sponsoredCount;
  document.getElementById('requestsCount').textContent = pendingCount;
}

// 5. دالة حذف يتيم من النظام
function deleteOrphan(id) {
  // تصفية المصفوفة وحذف العنصر المطلوب
  orphansList = orphansList.filter(orphan => orphan.id !== id);
  
  // إعادة رسم الجدول وتحديث الأرقام
  renderTable();
  updateDashboardCounters();
}

// 6. دالة افتراضية لمعاينة تفاصيل اليتيم (يمكنك ربطها بـ Modal لاحقاً)
function viewOrphan(id) {
  const orphan = orphansList.find(o => o.id === id);
  if(orphan) {
    alert(`تفاصيل اليتيم:\nالاسم: ${orphan.name}\nالعمر: ${orphan.age}\nالجنس: ${orphan.gender}\nالحالة: ${orphan.status}`);
  }
}
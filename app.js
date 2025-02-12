new Vue({
  el: "#app",
  data: {
    users: [],
    timeSlots: (() => {
      const slots = [];
      for (let hour = 8; hour <= 21; hour++) {
        slots.push({
          time: hour,
          display: `${hour}:00`,
          users: [],
        });
      }
      return slots;
    })(),
    showEditModal: false,
    editingUser: { id: null, name: "" },
  },
  created() {
    this.loadData();
  },
  methods: {
    handleDragStart(e, user) {
      e.dataTransfer.setData("text/plain", JSON.stringify(user));
    },
    handleDrop(e, timeSlot) {
      const user = JSON.parse(e.dataTransfer.getData("text/plain"));

      // 移除用户原有位置
      this.timeSlots.forEach((slot) => {
        slot.users = slot.users.filter((u) => u.id !== user.id);
      });

      // 添加到新位置
      timeSlot.users.push(user);
      this.saveData();
    },
    editUser(user) {
      this.editingUser = { ...user };
      this.showEditModal = true;
    },
    saveEdit() {
      if (!this.editingUser.name.trim()) return;

      const index = this.users.findIndex((u) => u.id === this.editingUser.id);
      if (index !== -1) {
        this.users.splice(index, 1, { ...this.editingUser });
      }
      this.showEditModal = false;
      this.saveData();
    },
    deleteUser() {
      const index = this.users.findIndex((u) => u.id === this.editingUser.id);
      if (index !== -1) {
        this.users.splice(index, 1);

        // 同时从时间表中移除
        this.timeSlots.forEach((slot) => {
          slot.users = slot.users.filter((u) => u.id !== this.editingUser.id);
        });
      }
      this.showEditModal = false;
      this.saveData();
    },
    addUser() {
      const newUser = {
        id: Date.now(),
        name: "新会员",
      };
      this.users.push(newUser);
      this.editUser(newUser);
    },
    saveData() {
      localStorage.setItem("users", JSON.stringify(this.users));
      localStorage.setItem("timeSlots", JSON.stringify(this.timeSlots));
    },
    loadData() {
      const savedUsers = localStorage.getItem("users");
      const savedTimeSlots = localStorage.getItem("timeSlots");

      if (savedUsers) this.users = JSON.parse(savedUsers);
      if (savedTimeSlots) this.timeSlots = JSON.parse(savedTimeSlots);
    },
  },
});

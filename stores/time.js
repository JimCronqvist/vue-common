import { defineStore } from 'pinia';

// Utility functions
const newDate = () => new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000); // now(): ms, getTimezoneOffset(): min
const toDate = date => date.toISOString().slice(0, 10);
const toDateAndHour = date => date.toISOString().slice(0, 13).replace('T', ' ') + ':00:00';
const toTime = date => date.toISOString().slice(11, 19);
const toTimestamp = date => date.toISOString().slice(0, 19).replace('T', ' ');

export const useTimeStore = defineStore('time', {
  state: () => ({
    now: newDate(), // 'now' is not an accurate Date, we have adjusted for the timezone offset to make things easier. Rely on the strings.
    date: toDate(newDate()),
    dateAndHour: toDateAndHour(newDate()),
    time: toTime(newDate()),
    timestamp: toTimestamp(newDate()),
    interval: null,
  }),

  actions: {
    setNow() {
      this.now = newDate();
      this.date = toDate(this.now);
      this.dateAndHour = toDateAndHour(this.now);
      this.time = toTime(this.now);
      this.timestamp = toTimestamp(this.now);
    },

    setIntervalFunction(seconds, callback) {
      if (this.interval === null) {
        this.interval = setInterval(() => {
          if (callback) {
            callback();
          }
        }, 1000 * seconds);
      }
    },

    clearIntervalFunction() {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
    },

    init() {
      setTimeout(() => {
        this.setNow();
        this.setIntervalFunction(60, () => this.setNow());
      }, 1000 * (60 - (new Date()).getSeconds()));
    },

    destroy() {
      this.clearIntervalFunction();
    },
  }
});

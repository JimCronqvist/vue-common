const getDefaultState = () => {
    return {
        visibility: false,
        message: "An error has occurred",
        color: "error",
        timeout: 6000,
        x: null,
        y: "bottom"
    };
};

let state = getDefaultState();

const mutations = {
    setVisibility: (state, visibility) => {
        state.visibility = visibility;
    },
    updateSettings(state, settings) {
        Object.assign(state, settings);
    }
};

const actions = {
    /**
     * Set the message and type an show the snackbar
     * @param commit
     * @param payload
     */
    showMessage({ commit }, payload) {
        commit("setVisibility", false);
        commit("updateSettings", Object.assign(getDefaultState(), payload));
        commit("setVisibility", true);
    }
};

const getters = {};

export default {
    state,
    mutations,
    actions,
    getters,
    namespaced: true
};

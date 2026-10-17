import { HolyGrailState, CharacterBuildPlan } from '../types';

const GRAIL_STORAGE_KEY = 'd2r_sanctuary_grail_v1';
const BUILDS_STORAGE_KEY = 'd2r_sanctuary_builds_v1';

export const loadHolyGrailState = (): HolyGrailState => {
  try {
    const raw = localStorage.getItem(GRAIL_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load Holy Grail state from localStorage:', err);
  }
  return {
    obtainedItemIds: {},
    etherealItemIds: {},
    perfectRollIds: {},
    notes: {},
    lastUpdated: new Date().toISOString()
  };
};

export const saveHolyGrailState = (state: HolyGrailState): void => {
  try {
    localStorage.setItem(GRAIL_STORAGE_KEY, JSON.stringify({
      ...state,
      lastUpdated: new Date().toISOString()
    }));
  } catch (err) {
    console.error('Failed to save Holy Grail state to localStorage:', err);
  }
};

export const loadBuildPlans = (): CharacterBuildPlan[] => {
  try {
    const raw = localStorage.getItem(BUILDS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load Build plans from localStorage:', err);
  }
  return [];
};

export const saveBuildPlans = (plans: CharacterBuildPlan[]): void => {
  try {
    localStorage.setItem(BUILDS_STORAGE_KEY, JSON.stringify(plans));
  } catch (err) {
    console.error('Failed to save Build plans to localStorage:', err);
  }
};

export const exportAllUserData = (): string => {
  const grail = loadHolyGrailState();
  const builds = loadBuildPlans();
  const exportPayload = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    grail,
    builds
  };
  return JSON.stringify(exportPayload, null, 2);
};

export const importUserData = (jsonString: string): boolean => {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed && (parsed.grail || parsed.builds)) {
      if (parsed.grail) {
        saveHolyGrailState(parsed.grail);
      }
      if (parsed.builds) {
        saveBuildPlans(parsed.builds);
      }
      return true;
    }
  } catch (err) {
    console.error('Failed to import user data JSON:', err);
  }
  return false;
};

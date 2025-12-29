const MS_PER_DAY = 24 * 60 * 60 * 1000;

function addDays(date, days) {
  const base = date instanceof Date ? date : new Date(date);
  return new Date(base.getTime() + days * MS_PER_DAY);
}

function daysRemaining(endsAt, now = new Date()) {
  if (!endsAt) return 0;
  const end = endsAt instanceof Date ? endsAt : new Date(endsAt);
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / MS_PER_DAY));
}

function ensureTrialFields(agency, { trialDays = 30 } = {}) {
  if (!agency) return agency;

  // Backfill from existing fields for older documents.
  if (!agency.trialStartedAt) {
    agency.trialStartedAt = agency.dateCreated || new Date();
  }

  if (!agency.trialEndsAt) {
    agency.trialEndsAt = addDays(agency.trialStartedAt, trialDays);
  }

  if (!agency.subscriptionPlan) {
    agency.subscriptionPlan = 'Trial';
  }

  return agency;
}

function getSubscriptionInfo(agency, { trialDays = 30 } = {}) {
  const now = new Date();
  ensureTrialFields(agency, { trialDays });

  const paidEndsAt = agency.subscriptionEndsAt ? new Date(agency.subscriptionEndsAt) : null;
  if (paidEndsAt && paidEndsAt.getTime() > now.getTime()) {
    return {
      status: 'active',
      planName: agency.subscriptionPlan || 'Paid',
      endsAt: paidEndsAt,
      daysRemaining: daysRemaining(paidEndsAt, now),
      trialEndsAt: agency.trialEndsAt || null,
      subscriptionEndsAt: paidEndsAt,
    };
  }

  const trialEndsAt = agency.trialEndsAt ? new Date(agency.trialEndsAt) : null;
  if (trialEndsAt && trialEndsAt.getTime() > now.getTime()) {
    return {
      status: 'trial',
      planName: agency.subscriptionPlan || 'Trial',
      endsAt: trialEndsAt,
      daysRemaining: daysRemaining(trialEndsAt, now),
      trialEndsAt,
      subscriptionEndsAt: agency.subscriptionEndsAt || null,
    };
  }

  return {
    status: 'expired',
    planName: agency.subscriptionPlan || 'Trial',
    endsAt: trialEndsAt,
    daysRemaining: 0,
    trialEndsAt,
    subscriptionEndsAt: agency.subscriptionEndsAt || null,
  };
}

module.exports = {
  MS_PER_DAY,
  addDays,
  daysRemaining,
  ensureTrialFields,
  getSubscriptionInfo,
};

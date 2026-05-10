const { sequelize } = require('../config/db');

const User = require('./User.model')(sequelize);
const Trip = require('./Trip.model')(sequelize);
const City = require('./City.model')(sequelize);
const TripStop = require('./TripStop.model')(sequelize);
const ActivityCategory = require('./ActivityCategory.model')(sequelize);
const Activity = require('./Activity.model')(sequelize);
const StopActivity = require('./StopActivity.model')(sequelize);
const ExpenseCategory = require('./ExpenseCategory.model')(sequelize);
const Expense = require('./Expense.model')(sequelize);
const PackingCategory = require('./PackingCategory.model')(sequelize);
const PackingItem = require('./PackingItem.model')(sequelize);
const Note = require('./Note.model')(sequelize);
const SavedDestination = require('./SavedDestination.model')(sequelize);
const SharedTripView = require('./SharedTripView.model')(sequelize);
const Notification = require('./Notification.model')(sequelize);
const UserSession = require('./UserSession.model')(sequelize);

// Associations
User.hasMany(Trip, { foreignKey: 'UserId' });
Trip.belongsTo(User, { foreignKey: 'UserId' });

User.hasMany(UserSession, { foreignKey: 'UserId', onDelete: 'CASCADE' });
UserSession.belongsTo(User, { foreignKey: 'UserId' });

Trip.hasMany(TripStop, { foreignKey: 'TripId' });
TripStop.belongsTo(Trip, { foreignKey: 'TripId' });

City.hasMany(TripStop, { foreignKey: 'CityId' });
TripStop.belongsTo(City, { foreignKey: 'CityId' });

City.hasMany(Activity, { foreignKey: 'CityId' });
Activity.belongsTo(City, { foreignKey: 'CityId' });

ActivityCategory.hasMany(Activity, { foreignKey: 'ActivityCategoryId' });
Activity.belongsTo(ActivityCategory, { foreignKey: 'ActivityCategoryId' });

TripStop.hasMany(StopActivity, { foreignKey: 'TripStopId', onDelete: 'CASCADE' });
StopActivity.belongsTo(TripStop, { foreignKey: 'TripStopId' });

Activity.hasMany(StopActivity, { foreignKey: 'ActivityId', onDelete: 'NO ACTION' });
StopActivity.belongsTo(Activity, { foreignKey: 'ActivityId' });

Trip.hasMany(Expense, { foreignKey: 'TripId' });
Expense.belongsTo(Trip, { foreignKey: 'TripId' });

ExpenseCategory.hasMany(Expense, { foreignKey: 'ExpenseCategoryId' });
Expense.belongsTo(ExpenseCategory, { foreignKey: 'ExpenseCategoryId' });

Trip.hasMany(PackingItem, { foreignKey: 'TripId' });
PackingItem.belongsTo(Trip, { foreignKey: 'TripId' });

PackingCategory.hasMany(PackingItem, { foreignKey: 'PackingCategoryId' });
PackingItem.belongsTo(PackingCategory, { foreignKey: 'PackingCategoryId' });

Trip.hasMany(Note, { foreignKey: 'TripId', onDelete: 'CASCADE' });
Note.belongsTo(Trip, { foreignKey: 'TripId' });

TripStop.hasMany(Note, { foreignKey: 'TripStopId', as: 'TripStopNotes', onDelete: 'NO ACTION' });
Note.belongsTo(TripStop, { foreignKey: 'TripStopId', as: 'TripStop' });

User.hasMany(Note, { foreignKey: 'UserId', onDelete: 'NO ACTION' });
Note.belongsTo(User, { foreignKey: 'UserId' });

User.hasMany(SavedDestination, { foreignKey: 'UserId' });
SavedDestination.belongsTo(User, { foreignKey: 'UserId' });

City.hasMany(SavedDestination, { foreignKey: 'CityId' });
SavedDestination.belongsTo(City, { foreignKey: 'CityId' });

Trip.hasMany(SharedTripView, { foreignKey: 'TripId' });
SharedTripView.belongsTo(Trip, { foreignKey: 'TripId' });

User.hasMany(Notification, { foreignKey: 'UserId' });
Notification.belongsTo(User, { foreignKey: 'UserId' });

module.exports = {
  sequelize,
  User, Trip, City, TripStop, ActivityCategory, Activity, StopActivity,
  ExpenseCategory, Expense, PackingCategory, PackingItem, Note,
  SavedDestination, SharedTripView, Notification, UserSession
};

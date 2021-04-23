 /**
 * Parent: Terrasoft.BaseDetailV2
 */
define("BaseGridDetailV2", ["ConfigurationEnums"], function(enums) {
	return {
		methods: {
			addRecord: function(editPageUId) {
				editPageUId = editPageUId || this.getFirstEditPageUId();
				if (!this.getIsCardValid()) {
					return;
				}
				const isNewCard = this.getIsCardNewRecordState();
				//const isCardChanged = this.getIsCardChanged();
				this.set("CardState", enums.CardStateV2.ADD);
				this.set("EditPageUId", editPageUId);
				this.set("PrimaryValueUId", null);
				if (isNewCard /* || isCardChanged*/) {
					const args = {
						isSilent: true,
						messageTags: [this.sandbox.id]
					};
					this.sandbox.publish("SaveRecord", args, [this.sandbox.id]);
				} else {
					this.openCardByMode();
				}
			}
		}
	};
});

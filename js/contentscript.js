// MAIN start

var NOTIF_CATEGORIES = ['qn_all', 'qn_answer', 'qn_post', 'qn_vote'
	, 'qn_comment', 'qn_others'];
var KEYWORD_TO_CATEGORY = {
	'wrote an answer for the question': NOTIF_CATEGORIES[1],
	'wrote': NOTIF_CATEGORIES[2],
	'shared': NOTIF_CATEGORIES[2],
	'voted up your answer to': NOTIF_CATEGORIES[3],
	'commented on your answer to': NOTIF_CATEGORIES[4],
};
var CATEGORY_CHANGED     = 'qn_category_changed';
var UNSEEN_CHANGED       = 'qn_unseen_changed';
var CATEGORY_STYLE       = 'qn_category_stylesheet';
var UNSEEN_STYLE         = 'qn_unseen_stylesheet';
var IS_CLASSIFIED        = 'qn_answer_classified'

// save the last question item in every question
var lastQuestion = {};

$('ul.notifications_list .pagedlist_item').each(function(index) {
	$this = $(this);
	classifyNotif($this);
});

createCategoryRadio();

// MAIN end

// LISTENERS start

$('ul.notifications_list')
	.observe('added', '.pagedlist_item', function(record) {
		var $addedNodes = $(record.addedNodes);

		if ($addedNodes.hasClass(IS_CLASSIFIED)) return;

		classifyNotif($addedNodes);
	});

$(document).on(CATEGORY_CHANGED, function(event, category) {
	showCategory(category);
})

$(document).on(UNSEEN_CHANGED, function(event, unseen) {
	toggleUnseen(unseen);
});

$('.qn_notif_category').change(function () {
	var category = $(this).val();
	$(document).trigger(CATEGORY_CHANGED, [category]);
});

$('.qn_notif_unseen').change(function () {
	var unseen = this.checked;
	$(document).trigger(UNSEEN_CHANGED, [unseen]);
});

// LISTENERS end

// FUNCTIONS start

function classifyNotif($notifDiv) {
	var notifText = getNotifText($notifDiv);
	if (notifText in KEYWORD_TO_CATEGORY) {
		$notifDiv.addClass(KEYWORD_TO_CATEGORY[notifText]);
	}
	else {
		$notifDiv.addClass(NOTIF_CATEGORIES[NOTIF_CATEGORIES.length - 1]);
	}

	$notifDiv.addClass(IS_CLASSIFIED);
}

function getNotifText($notifDiv) {
	return $notifDiv.find('.notification_text > span')
		.contents().filter(function() {
			return this.nodeType === 3;
		})
		.first().text().replace('Anonymous', '').trim();
}

function createStylesheet(styleName) {
	if ($('#' + styleName).length) return;
	else {
		$('head').append('<style id="' + styleName + '"></style>');
	}
}

function showCategory(category) {
	createStylesheet(CATEGORY_STYLE);
	
	if (category === NOTIF_CATEGORIES[0]) {
		$('#' + CATEGORY_STYLE).html('');
		return;
	}

	rules = [];
	for (var i = 0; i < NOTIF_CATEGORIES.length; i++) {
		var value = NOTIF_CATEGORIES[i];
		if (value !== category) {
			rules.push(' .' + value + ' { display: none; }');
		}
	}

	$('#' + CATEGORY_STYLE).html(rules.join(''));
}

function toggleUnseen(unseen) {
	createStylesheet(UNSEEN_STYLE);

	if (unseen) {
		$('#' + UNSEEN_STYLE).html('li.seen { display: none; }');
	}
	else {
		$('#' + UNSEEN_STYLE).html('');
		return;
	}
}

// FUNCTIONS end

// TEMPLATES start

function createCategoryRadio() {
	var element = '<div class="qn_category"> <div class="qn_form_group"> <input type="radio" class="qn_notif_category" name="qn_notif_category" id="qn_all" value="qn_all" checked="checked"> <label for="qn_all">All</label> </div> <div class="qn_form_group"> <input type="radio" class="qn_notif_category" name="qn_notif_category" id="qn_answer" value="qn_answer"> <label for="qn_answer">Answers</label> </div> <div class="qn_form_group"> <input type="radio" class="qn_notif_category" name="qn_notif_category" id="qn_post" value="qn_post"> <label for="qn_post">Posts</label> </div> <div class="qn_form_group"> <input type="radio" class="qn_notif_category" name="qn_notif_category" id="qn_vote" value="qn_vote"> <label for="qn_vote">Votes</label> </div> <div class="qn_form_group"> <input type="radio" class="qn_notif_category" name="qn_notif_category" id="qn_comment" value="qn_comment"> <label for="qn_comment">Comments</label> </div> <div class="qn_form_group"> <input type="radio" class="qn_notif_category" name="qn_notif_category" id="qn_others" value="qn_others"> <label for="qn_others">Others</label> </div> <div class="qn_form_group"> <input type="checkbox" class="qn_notif_unseen" name="qn_notif_unseen" id="qn_notif_unseen" value="unseen"> <label for="qn_notif_unseen">Unseen?</label> </div> </div>';
	$('h1').after(element);
}

// TEMPLATES end
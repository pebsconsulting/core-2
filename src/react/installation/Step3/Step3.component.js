import React from 'react';
import { withRouter } from 'react-router-dom';
import { generalUtils } from '../../utils';

const Step2 = ({ i18n, language, availableLanguages, onSelectLanguage, history }) => {
	const onSubmit = (e) => {
		e.preventDefault();
		history.push('/step4');
	};

	const submitBtnLabel = generalUtils.decodeEntities(i18n.word_continue_rightarrow);

	return (
		<form method="post" onSubmit={onSubmit}>
			Page 3.

			<p>
				<input type="submit" name="next" value={submitBtnLabel}/>
			</p>
		</form>
	);
};

export default withRouter(Step2);

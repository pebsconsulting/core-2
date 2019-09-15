import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styles from '../Page/Page.scss';
import Button from '../../components/Buttons';
import { NotificationPanel } from '../../components';
import { generalUtils } from '../../utils';


class Step3 extends Component {
	constructor (props) {
		super(props);
		this.onSubmit = this.onSubmit.bind(this);
		this.onSuccess = this.onSuccess.bind(this);
		this.onError = this.onError.bind(this);

		this.notificationPanel = React.createRef();

		// we'll have to determine a better way to validate forms going forward. Formik?
		this.dbHostname = React.createRef();
		this.dbName = React.createRef();
		this.dbPort = React.createRef();
		this.dbUsername = React.createRef();
		this.dbPassword = React.createRef();
		this.dbTablePrefix = React.createRef();
	}

	onSubmit (e) {
		e.preventDefault();
		const { i18n, dbHostname, dbName, dbUsername, dbTablePrefix, saveDbSettings } = this.props;

		const errors = [];
		const fields = [];
		if (!dbHostname) {
			fields.push('dbHostname');
			errors.push(i18n.validation_no_db_hostname);
		}
		if (!dbName) {
			fields.push('dbName');
			errors.push(i18n.validation_no_db_name);
		} else if (/[.\\/\\\\]/.test(dbName)) {
			fields.push('dbName');
			errors.push(i18n.validation_db_name);
		}
		if (!dbUsername) {
			fields.push('dbUsername');
			errors.push(i18n.validation_no_db_username);
		}
		if (!dbTablePrefix) {
			fields.push('dbTablePrefix');
			errors.push(i18n.validation_no_table_prefix);
		} else if (!(/^[0-9a-z_]+$/.test(dbTablePrefix))) {
			fields.push('dbTablePrefix');
			errors.push(i18n.validation_invalid_table_prefix);
		}

		if (errors.length) {
			const error = `${i18n.phrase_error_text_intro}<br />&bull; ` + errors.join('<br />&bull; ');
			this.notificationPanel.current.add({ msg: error, msgType: 'error' });
			this[fields[0]].current.focus();
		} else {
			saveDbSettings(this.onSuccess, this.onError);
		}
	};

	onSuccess () {
		this.props.history.push('/step4');
	}

	onError ({ error, response }) {
		const { i18n } = this.props;
		this.notificationPanel.current.clear();
		const msg = generalUtils.evalI18nString(i18n.notify_install_invalid_db_info, { db_connection_error: response });
		this.notificationPanel.current.add({ msg, msgType: 'error' });
	}

	getTablesAlreadyExistContent () {
		const { existingTables } = this.props;

		return (
			<div>
				<h2>Tables already exist!</h2>

				include file='messages.tpl'

				<div className="error margin_bottom_large">
					<div style="padding: 6px">
						<b>Warning!</b> It appears that some tables already exist with the table prefix that you
						specified
						(see list below). You can either choose to overwrite these tables or pick a new table prefix.
					</div>
				</div>

				<div className={styles.existingTables}>
					<blockquote>
						<pre>{existingTables}</pre>
					</blockquote>
				</div>

				<form action="" method="post">
					<p>
						<input type="submit" name="overwrite_tables" value="Overwrite Tables" className={styles.red} />
						<input type="submit" name="pick_new_table_prefix" value="Pick New Table Prefix"/>
					</p>
				</form>
			</div>
		);
	}

	getMessage () {
		const { msgType, msg } = this.props;


		/*
		{if $error != ""}

		<div class="error" style="padding: 5px; margin-top: 8px">
			{i18n.phrase_error_occurred_c}<br />
			<br />
			<div class="red">{$error}</div>
			<br/>
			{i18n.phrase_check_db_settings_try_again}
		</div>

		<p><b>{$LANG.word_tips}</b></p>

		<ul class="tips">
			<li><div>{i18n.text_install_db_tables_error_tip_1}</div></li>
			<li><div>{i18n.text_install_db_tables_error_tip_2}</div></li>
			<li><div>{i18n.text_install_db_tables_error_tip_3}</div></li>
			<li><div>{i18n.text_install_db_tables_error_tip_4}</div></li>
		</ul>
     	{/if}
		*/
	}

	getContent () {
		const { i18n, dbHostname, dbName, dbPort, dbUsername, dbPassword, dbTablePrefix, updateField } = this.props;

		return (
			<div>
				<h2>{i18n.phrase_create_database_tables}</h2>

				<p dangerouslySetInnerHTML={{ __html: i18n.text_install_create_database_tables}} />

				<NotificationPanel ref={this.notificationPanel} />

				<form method="post" onSubmit={this.onSubmit}>

					<p><b>{i18n.phrase_database_settings}</b></p>

					<table cellPadding="1" cellSpacing="0" className={styles.info}>
						<tbody>
						<tr>
							<td className="label" width="140">{i18n.phrase_database_hostname}</td>
							<td>
								<input type="text" size="20" value={dbHostname} autoFocus ref={this.dbHostname}
							       onChange={(e) => updateField('dbHostname', e.target.value)}/> {i18n.phrase_often_localhost}
							</td>
						</tr>
						<tr>
							<td className="label">{i18n.phrase_database_name}</td>
							<td>
								<input type="text" size="20" value={dbName} maxLength="64" ref={this.dbName}
								       onChange={(e) => updateField('dbName', e.target.value)}/>
							</td>
						</tr>
						<tr>
							<td className="label">{i18n.word_port}</td>
							<td>
								<input type="text" size="10" value={dbPort} ref={this.dbPort}
								       onChange={(e) => updateField('dbPort', e.target.value)}/>
							</td>
						</tr>
						<tr>
							<td className="label">{i18n.phrase_database_username}</td>
							<td>
								<input type="text" size="20" value={dbUsername} ref={this.dbUsername}
								       onChange={(e) => updateField('dbUsername', e.target.value)}/>
							</td>
						</tr>
						<tr>
							<td className="label">{i18n.phrase_database_password}</td>
							<td>
								<input type="text" size="20" value={dbPassword} ref={this.dbPassword}
								       onChange={(e) => updateField('dbPassword', e.target.value)}/>
							</td>
						</tr>
						<tr>
							<td className="label">{i18n.phrase_database_table_prefix}</td>
							<td>
								<input type="text" size="20" maxLength="10" value={dbTablePrefix} ref={this.dbTablePrefix}
								       onChange={(e) => updateField('dbTablePrefix', e.target.value)}/>
							</td>
						</tr>
						</tbody>
					</table>

					<p>
						<Button type="submit">{i18n.phrase_create_database_tables}</Button>
					</p>
				</form>
			</div>
		);
	}

	render () {
		const { tablesAlreadyExist } = this.props;
		let content;

		if (tablesAlreadyExist) {
			content = this.getTablesAlreadyExistContent();
		} else {
			content = this.getContent();
		}

		return content;
	}
}


export default withRouter(Step3);

/* eslint-disable max-len */
import { FC } from 'react';
import { BlackListTypeProps } from '../types/BlackListScheme';
import classes from './blackListContent.module.scss';


type BlackListTableMobileProps = {
  playerName: string;
  teamName: string;
  reason: string;
  period: string;
  handleGetPlayers: (id: number) => void;
  results: BlackListTypeProps[];
};

export const BlackListTableMobile: FC<BlackListTableMobileProps> = ({
  playerName,
  teamName,
  reason,
  period,
  handleGetPlayers,
  results,
}) => {
  if (!results || results.length === 0) return null;

  return (
    <div className={classes.container}>
      <table>
        {results[ 0 ].player_name && (<tr>
          <th className={classes.fixedTd}>{playerName}</th>
          {results.map((item) => (
            <td key={item.id} className={classes.scrollableTd} fixed-hd>{item.player_name}</td>
          ))}
        </tr>)}
        <tr>
          <th className={classes.fixedTd}>{teamName}</th>
          {results.map((item) => (
            <td key={item.id} className={classes.scrollableTd} fixed-hd>
              {item.player_name ? item.team_name : (
                <button onClick={() => handleGetPlayers(item.team)}>
                  {item.team_name}
                </button>
              )}
            </td>
          ))}
        </tr>
        <tr>
          <th className={classes.fixedTd}>{reason}</th>
          {results.map((item) => (
            <td key={item.id} className={classes.scrollableTd} fixed-hd>{item.reason}</td>
          ))}
        </tr>
        <tr>
          <th className={classes.fixedTd}>{period}</th>
          {results.map((item) => (
            <td key={item.id} className={classes.scrollableTd} fixed-hd>{item.period_start} - {item.period_end}</td>
          ))}
        </tr>
      </table>
    </div>
  );
};

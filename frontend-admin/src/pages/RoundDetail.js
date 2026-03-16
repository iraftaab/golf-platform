import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { roundApi } from '../services/api';

export default function RoundDetail() {
  const { id } = useParams();
  const [round, setRound] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    roundApi.getById(id).then(r => { setRound(r); setLoading(false); }).catch(console.error);
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!round) return <p>Round not found.</p>;

  const par = round.scores?.reduce((sum, s) => sum + (s.hole?.par ?? 0), 0);
  const toPar = round.totalScore != null && par ? round.totalScore - par : null;

  return (
    <div>
      <Link to="/rounds">← Back to Rounds</Link>
      <h1>Round #{round.id}</h1>
      <p>
        <strong>Player:</strong> {round.player?.firstName} {round.player?.lastName} &nbsp;|&nbsp;
        <strong>Course:</strong> {round.course?.name} &nbsp;|&nbsp;
        <strong>Date:</strong> {round.datePlayed} &nbsp;|&nbsp;
        <strong>Status:</strong> {round.status}
      </p>
      {round.totalScore != null && (
        <p>
          <strong>Total:</strong> {round.totalScore} &nbsp;
          {toPar != null && (
            <span style={{ color: toPar < 0 ? '#2e7d32' : toPar > 0 ? '#c62828' : '#555' }}>
              ({toPar > 0 ? '+' : ''}{toPar})
            </span>
          )}
        </p>
      )}

      {round.scores?.length > 0 ? (
        <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>Hole</th><th>Par</th><th>Strokes</th><th>+/-</th>
              <th>Putts</th><th>FIR</th><th>GIR</th>
            </tr>
          </thead>
          <tbody>
            {round.scores.map(s => {
              const diff = s.strokes - (s.hole?.par ?? 0);
              const diffColor = diff < 0 ? '#2e7d32' : diff > 0 ? '#c62828' : '#555';
              return (
                <tr key={s.id}>
                  <td>{s.hole?.holeNumber}</td>
                  <td>{s.hole?.par}</td>
                  <td>{s.strokes}</td>
                  <td style={{ color: diffColor, fontWeight: 'bold' }}>
                    {diff === 0 ? 'E' : diff > 0 ? `+${diff}` : diff}
                  </td>
                  <td>{s.putts ?? '—'}</td>
                  <td>{s.fairwayHit == null ? '—' : s.fairwayHit ? '✓' : '✗'}</td>
                  <td>{s.greenInRegulation == null ? '—' : s.greenInRegulation ? '✓' : '✗'}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ fontWeight: 'bold', background: '#f5f5f5' }}>
              <td>Total</td><td>{par}</td><td>{round.totalScore}</td>
              <td style={{ color: toPar < 0 ? '#2e7d32' : toPar > 0 ? '#c62828' : '#555' }}>
                {toPar === 0 ? 'E' : toPar > 0 ? `+${toPar}` : toPar}
              </td>
              <td colSpan="3"></td>
            </tr>
          </tfoot>
        </table>
      ) : (
        <p style={{ color: '#666' }}>No scores recorded yet.</p>
      )}
    </div>
  );
}

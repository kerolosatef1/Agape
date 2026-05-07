"use client";

import React, { useState } from "react";
import { useAllSeasons } from "../hooks/seasons.hooks";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import Loader from "@/src/shared/ui/Loader";
import EditSeasonDialog from "./EditSeasonDialog";
import DeleteSeasonDialog from "./DeleteSeasonDialog";
import ActivateSeasonDialog from "./ActivateSeasonDialog";
import { ISeason } from "../types/types";

const SeasonsList: React.FC = () => {
  const t = useTranslations("pages.seasons");
  const { data: seasons, isLoading } = useAllSeasons();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activateOpen, setActivateOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<ISeason | null>(null);

  if (isLoading) return <Loader />;

  if (!seasons || seasons.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          {t("empty")}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {seasons.map((season) => (
          <Card key={season.seasonId} className={`relative ${season.isActive ? "border-green-400 border-2" : ""}`}>
            <CardContent className="pt-6">
              {/* Active badge */}
              {season.isActive && (
                <Badge className="absolute top-3 end-3 bg-green-100 text-green-700 border-0">
                  {t("active")}
                </Badge>
              )}

              <h3 className="text-lg font-semibold mb-1 pe-16">{season.seasonName}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {season.date ? new Date(season.date).toLocaleDateString() : "—"}
              </p>

              <div className="flex gap-2 flex-wrap">
                {/* Edit */}
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => {
                    setSelectedSeason(season);
                    setEditOpen(true);
                  }}
                >
                  <Pencil size={14} />
                  {t("editBtn")}
                </Button>

                {/* Activate (only if not active) */}
                {!season.isActive && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 text-green-600 hover:text-green-700"
                    onClick={() => {
                      setSelectedSeason(season);
                      setActivateOpen(true);
                    }}
                  >
                    <Zap size={14} />
                    {t("activateBtn")}
                  </Button>
                )}

                {/* Delete (only if not active) */}
                {!season.isActive && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 text-destructive hover:text-destructive"
                    onClick={() => {
                      setSelectedSeason(season);
                      setDeleteOpen(true);
                    }}
                  >
                    <Trash2 size={14} />
                    {t("deleteBtn")}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <EditSeasonDialog open={editOpen} onOpenChange={setEditOpen} season={selectedSeason} />
      <DeleteSeasonDialog open={deleteOpen} onOpenChange={setDeleteOpen} season={selectedSeason} />
      <ActivateSeasonDialog open={activateOpen} onOpenChange={setActivateOpen} season={selectedSeason} />
    </>
  );
};

export default SeasonsList;